'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Patient } from '@/lib/types';
import {
  X,
  Phone,
  MapPin,
  Calendar,
  Eye,
  FileText,
  Pill,
  Clock,
  Printer,
  Plus,
  Stethoscope,
  IndianRupee,
  Save,
  Check,
  Glasses,
  UserCheck,
  Trash2,
} from 'lucide-react';

export type PatientTab = 'profile' | 'visit-history' | 'prescriptions' | 'medicine-purchases' | 'notes';

interface PatientDetailDrawerProps {
  patient: Patient;
  onClose: () => void;
  initialTab?: PatientTab;
}

export const PatientDetailDrawer: React.FC<PatientDetailDrawerProps> = ({
  patient,
  onClose,
  initialTab = 'profile',
}) => {
  const { visits, prescriptions, updatePatient, addToast, deleteVisit, deletePrescription } = useApp();
  const [activeTab, setActiveTab] = useState<PatientTab>(initialTab);
  const router = useRouter();

  // Editable notes state
  const [patientNotes, setPatientNotes] = useState(
    patient.notes || 'Mild myopia (both eyes). Prescribed glasses in 2023, updated power 2025.'
  );
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Filter patient visits and prescriptions
  const patientVisits = visits.filter((v) => v.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter((rx) => rx.patientId === patient.id);

  // Calculate total spending
  const totalSpending = patientVisits.reduce((acc, v) => acc + (v.payment?.grandTotal || 0), 0);

  // Collect all medicine purchases
  const medicinePurchases = patientVisits.flatMap((v) =>
    v.medicines.map((m) => ({
      ...m,
      date: v.date,
      visitId: v.id,
      invoiceNumber: v.payment?.invoiceNumber,
    }))
  );

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    updatePatient(patient.id, { notes: patientNotes });
    setTimeout(() => {
      setIsSavingNotes(false);
      addToast('Notes Saved', `Updated clinical notes for ${patient.name}`);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end transition-opacity">
      <div
        id="patient-detail-drawer"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200"
      >
        {/* DRAWER HEADER (MATCHING REFERENCE IMAGE 1) */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {patient.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{patient.displayId || patient.id}</span> •{' '}
              {patient.age} yrs • {patient.gender}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="drawer-start-visit-btn"
              onClick={() => {
                onClose();
                router.push(`/dashboard/visit/new?patientId=${patient.id}`);
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1 transition-all active:scale-95"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>New Exam</span>
            </button>

            <button
              id="drawer-close-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5 HORIZONTAL TABS (MATCHING REFERENCE IMAGE 1 EXACTLY) */}
        <div className="px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'profile', label: 'Profile' },
              { id: 'visit-history', label: 'Visit History' },
              { id: 'prescriptions', label: 'Prescriptions' },
              { id: 'medicine-purchases', label: 'Medicine Purchases' },
              { id: 'notes', label: 'Notes' },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`drawer-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/40 dark:bg-slate-950/20">
          
          {/* 1. PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Contact Info List */}
              <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200 font-medium">
                  <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200 font-medium">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{patient.address || 'No address provided'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200 font-medium">
                  <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Last visit {patient.lastVisitDate || '2026-07-20'} • Next 2026-08-15
                  </span>
                </div>
              </div>

              {/* Medical History Card */}
              <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Medical History
                </h4>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {patientNotes || 'Mild myopia (both eyes). Prescribed glasses in 2023, updated power 2025.'}
                </p>
              </div>

              {/* Stat Cards: Total Spending & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[11px] font-bold text-slate-400 block">Total Spending</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    ₹{(totalSpending || 4200).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[11px] font-bold text-slate-400 block">Status</span>
                  <div className="mt-1">
                    {patient.outstandingAmount > 0 ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 text-xs font-bold">
                        Pending ₹{patient.outstandingAmount}
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-bold">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. VISIT HISTORY TAB */}
          {activeTab === 'visit-history' && (
            <div className="space-y-3">
              {patientVisits.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium">No prior visits recorded for this patient.</p>
                </div>
              ) : (
                patientVisits.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                          {v.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{v.date}</span>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this visit?')) {
                              deleteVisit(v.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Visit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Complaint: {v.chiefComplaint}
                      </span>
                      <p className="text-slate-500 mt-0.5">Diagnosis: {v.diagnosis}</p>
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Total: ₹{v.payment?.grandTotal}
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          router.push(`/dashboard/visit/${v.id}`);
                        }}
                        className="text-xs font-bold text-indigo-600 hover:underline"
                      >
                        View Order & Rx &rarr;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. PRESCRIPTIONS TAB */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-3">
              {patientPrescriptions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium">No prescriptions found for this patient.</p>
                </div>
              ) : (
                patientPrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        {rx.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{rx.date}</span>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this prescription?')) {
                              deletePrescription(rx.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Prescription"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {rx.lens && (
                      <p className="text-slate-700 dark:text-slate-300 font-medium">
                        Lens: {rx.lens.brand} ({rx.lens.lensType})
                      </p>
                    )}
                    {rx.frame && (
                      <p className="text-slate-500">
                        Frame: {rx.frame.brand} {rx.frame.frameName}
                      </p>
                    )}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 text-[11px]">
                        Inv: {rx.payment?.invoiceNumber}
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          router.push(`/dashboard/prescription/${rx.id}`);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-2xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Rx</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 4. MEDICINE PURCHASES TAB */}
          {activeTab === 'medicine-purchases' && (
            <div className="space-y-3">
              {medicinePurchases.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <Pill className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium">No medicine purchases recorded.</p>
                </div>
              ) : (
                medicinePurchases.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Pill className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{m.medicineName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Dosage: {m.morning}-{m.afternoon}-{m.night} for {m.days} days ({m.instructions})
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        Date: {m.date} • Inv #: {m.invoiceNumber || 'INV-2026-0042'}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-slate-900 dark:text-white font-mono">
                        ₹{m.totalPrice || m.unitPrice * m.totalQty}
                      </div>
                      <span className="text-[10px] text-slate-400">{m.totalQty} Units</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 5. NOTES TAB */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Patient Medical & Clinical Notes
                </label>
                <textarea
                  id="drawer-patient-notes-textarea"
                  rows={6}
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  placeholder="Type allergy details, vision observations, lens wear preferences..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-medium"
                ></textarea>

                <div className="flex justify-end">
                  <button
                    id="save-drawer-notes-btn"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md transition-all active:scale-95"
                  >
                    {isSavingNotes ? <Check className="w-4 h-4 animate-bounce" /> : <Save className="w-4 h-4" />}
                    <span>{isSavingNotes ? 'Saving...' : 'Save Notes'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
