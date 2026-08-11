import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { mapPatient, mapVisit, mapPrescription } from '@/lib/supabase/mappers';
import { Patient, Visit, Prescription } from '@/lib/types';

export function usePatientProfile(patientId: string) {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: async (): Promise<{ patient: Patient; visits: Visit[]; prescriptions: Prescription[] }> => {
      const { data, error } = await createClient()
        .from('patients')
        .select(`
          *,
          visits (*),
          prescriptions (*)
        `)
        .eq('id', patientId)
        .single();

      if (error) throw error;

      return {
        patient: mapPatient(data),
        visits: (data.visits || []).map((v: any) => mapVisit({ ...v, patients: data })),
        prescriptions: (data.prescriptions || []).map((p: any) => mapPrescription({ ...p, patients: data, visits: data.visits?.find((v: any) => v.id === p.visit_id) })),
      };
    },
    enabled: !!patientId,
  });
}
