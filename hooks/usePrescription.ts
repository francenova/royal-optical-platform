import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { mapPrescription } from '@/lib/supabase/mappers';

export function usePrescription(prescriptionId: string) {
  return useQuery({
    queryKey: ['prescription', prescriptionId],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('prescriptions')
        .select(`
          *,
          patients (*),
          visits (*)
        `)
        .eq('id', prescriptionId)
        .single();

      if (error) throw error;

      return mapPrescription(data);
    },
    enabled: !!prescriptionId,
  });
}
