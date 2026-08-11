import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

export function useDashboardStats() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const getTodayRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = today.toISOString();
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const end = tomorrow.toISOString();
    return { start, end };
  };

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const todayStr = new Date().toISOString().split('T')[0];

      // Fetch Today's Visits
      const { data: visits } = await supabase
        .from('visits')
        .select('*, payment')
        .eq('date', todayStr);

      // Fetch Today's Prescriptions
      const { count: prescriptionsCount } = await supabase
        .from('prescriptions')
        .select('id', { count: 'exact', head: true })
        .eq('date', todayStr);

      // Fetch Today's Expenses
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('date', todayStr);

      // Global pending stats (not just today)
      const { data: pendingDeliveries } = await supabase
        .from('visits')
        .select('id')
        .eq('status', 'Pending Delivery');

      const { data: readyOrders } = await supabase
        .from('visits')
        .select('id')
        .eq('status', 'Ready Order');

      // Outstanding amount sum
      // Supabase JS doesn't have aggregate sum yet natively without RPC, 
      // but we can fetch patients with outstanding > 0
      const { data: debtors } = await supabase
        .from('patients')
        .select('outstanding_amount')
        .gt('outstanding_amount', 0);

      const todayVisits = visits || [];
      const todayExpensesData = expenses || [];
      const debtorsData = debtors || [];

      const todayRevenue = todayVisits.reduce((acc, v) => acc + (v.payment?.grandTotal || 0), 0);
      const todayExpenses = todayExpensesData.reduce((acc, e) => acc + e.amount, 0);
      const todayProfit = Math.max(0, todayRevenue - todayExpenses);
      const todayMedicineSales = todayVisits.reduce((acc, v) => acc + (v.payment?.medicineTotal || 0), 0);
      const pendingPaymentsTotal = debtorsData.reduce((acc, p) => acc + p.outstanding_amount, 0);
      
      const todayPatientsCount = new Set(todayVisits.map((v) => v.patient_id)).size;

      return {
        todayVisits: todayVisits.length,
        todayPatientsCount,
        todayPrescriptionsCount: prescriptionsCount || 0,
        todayRevenue,
        todayExpenses,
        todayProfit,
        todayMedicineSales,
        pendingPaymentsTotal,
        pendingDeliveriesCount: pendingDeliveries?.length || 0,
        readyOrdersCount: readyOrders?.length || 0,
      };
    }
  });

  // Real-time subscriptions to keep the dashboard live
  useEffect(() => {
    const channel = supabase.channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visits' }, () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prescriptions' }, () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);

  return { stats: data, isLoading };
}
