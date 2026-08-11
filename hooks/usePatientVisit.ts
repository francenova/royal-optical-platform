import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { mapVisit, mapPatient } from '@/lib/supabase/mappers';

export function usePatientVisit(visitId: string) {
  return useQuery({
    queryKey: ['visit', visitId],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('visits')
        .select(`
          *,
          patients (*)
        `)
        .eq('id', visitId)
        .single();

      if (error) throw error;

      return {
        visit: mapVisit(data),
        patient: data.patients ? mapPatient(data.patients) : null,
      };
    },
    enabled: !!visitId,
  });
}
