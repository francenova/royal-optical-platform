import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { mapClinicSettings } from '@/lib/supabase/mappers';
import { ClinicSettings } from '@/lib/types';

export const DEFAULT_CLINIC_SETTINGS: ClinicSettings = {
  id: 1,
  clinicName: 'Royal Opticals',
  businessTypes: ['Optical Shop', 'Eye Clinic', 'Computerized Eye Testing', 'Contact Lens Center', 'Spectacle Sales'],
  address: '',
  phone: '',
  email: '',
  doctorName: '',
  doctorTitle: '',
  credentials: '',
  registrationNumber: '',
  defaultConsultationFee: 200,
  defaultPrinter: '',
  currencySymbol: '₹',
  currency: 'INR (₹)',
  language: 'English',
  logoUrl: '',
  enableAutoSave: true,
  theme: 'light',
  updatedAt: new Date().toISOString(),
};

export function useClinicSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['clinic_settings'],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('clinic_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return DEFAULT_CLINIC_SETTINGS;
      return mapClinicSettings(data as Record<string, unknown>);
    },
  });

  const mutation = useMutation({
    mutationFn: async (updates: Partial<ClinicSettings>) => {
      // Need to convert camelCase updates to snake_case
      const snakeUpdates: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(updates)) {
        snakeUpdates[k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)] = v;
      }

      const { error } = await createClient()
        .from('clinic_settings')
        .update(snakeUpdates)
        .eq('id', 1);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic_settings'] });
    },
  });

  return {
    settings: query.data || DEFAULT_CLINIC_SETTINGS,
    isLoading: query.isLoading,
    isError: query.isError,
    updateSettings: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
