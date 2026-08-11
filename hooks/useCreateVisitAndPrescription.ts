import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Visit, Prescription } from '@/lib/types';
import { appToDbRow } from '@/lib/supabase/mappers';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export function useCreateVisitAndPrescription() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { addToast } = useApp();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (data: {
      visitData: Omit<Visit, 'id' | 'displayId'>;
      medicines: any[]; // Inventory medicines to deduct stock
      skipNavigation?: boolean;
    }) => {
      const { visitData, medicines } = data;

      // 1. Insert Visit
      const { patientName, patientAge, patientGender, patientPhone, patientAddress, ...visitDataForDb } = visitData as any;
      const visitRow = appToDbRow(visitDataForDb);
      
      const { data: insertedVisit, error: visitError } = await supabase
        .from('visits')
        .insert(visitRow)
        .select()
        .single();

      if (visitError) throw new Error(`Visit Error: ${visitError.message}`);

      const realVisitId = insertedVisit.id;

      // 2. Insert Prescription
      const rxRow = appToDbRow({
        visitId: realVisitId,
        patientId: visitData.patientId,
        date: visitData.date,
        visionTest: visitData.visionTest,
        diagnosis: visitData.diagnosis,
        medicines: visitData.medicines,
        contactLens: visitData.contactLens,
        frame: visitData.frame,
        lens: visitData.lens,
        doctorNotes: visitData.doctorNotes,
        payment: visitData.payment,
        printedCount: 0,
      });

      const { data: insertedRx, error: rxError } = await supabase
        .from('prescriptions')
        .insert(rxRow)
        .select()
        .single();

      if (rxError) throw new Error(`Prescription Error: ${rxError.message}`);

      // 3. Deduct Medicine Stock
      for (const prescribed of visitData.medicines) {
        if (prescribed.totalQty > 0) {
          const matchingMed = medicines.find(
            (med) =>
              (prescribed.medicineId && prescribed.medicineId === med.id) ||
              (prescribed.medicineName &&
                (prescribed.medicineName.toLowerCase().trim() === med.name.toLowerCase().trim() ||
                  med.name.toLowerCase().trim().includes(prescribed.medicineName.toLowerCase().trim()) ||
                  prescribed.medicineName.toLowerCase().trim().includes(med.name.toLowerCase().trim())))
          );
          if (matchingMed) {
            const newQty = Math.max(0, matchingMed.availableStock - prescribed.totalQty);
            await supabase
              .from('medicines')
              .update({ available_stock: newQty })
              .eq('id', matchingMed.id);
          }
        }
      }

      // 4. Update Patient Record
      await supabase
        .from('patients')
        .update({
          last_visit_date: visitData.date,
          outstanding_amount: visitData.payment.balance,
        })
        .eq('id', visitData.patientId);

      // 5. Activity Log
      const activityRow = appToDbRow({
        timestamp: new Date().toISOString(),
        type: 'visit',
        title: 'Eye Test & Prescription Created',
        description: `Visit ${insertedVisit.display_id || realVisitId} & Rx ${insertedRx.display_id || insertedRx.id} created for ${visitData.patientName}. Total: ₹${visitData.payment.grandTotal}`,
        patientName: visitData.patientName,
        amount: visitData.payment.grandTotal,
      });

      await supabase.from('activity_log').insert(activityRow);

      return { insertedVisit, insertedRx };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['activity_log'] });

      addToast('Success', 'Visit and Prescription created successfully.', 'success');
      
      if (!variables.skipNavigation) {
        // Deep linked navigation to the new prescription
        router.push(`/dashboard/prescription/${data.insertedRx.id}`);
      }
    },
    onError: (error: Error) => {
      console.error(error);
      addToast('Error', error.message, 'error');
    },
  });
}
