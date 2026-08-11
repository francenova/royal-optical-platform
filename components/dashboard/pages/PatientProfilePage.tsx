'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePatientProfile } from '@/hooks/usePatientProfile';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  Eye,
  FileText,
  Pill,
  Glasses,
  Clock,
  Printer,
  Plus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const PatientProfilePage: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const { data, isLoading, isError } = usePatientProfile(id);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <p>Loading patient profile...</p>
      </div>
    );
  }

  if (isError || !data?.patient) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Patient not found or error loading.</p>
        <button
          onClick={() => router.push('/dashboard/patients')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          Back to Patient List
        </button>
      </div>
    );
  }

  const { patient, visits: patientVisits, prescriptions: patientPrescriptions } = data;

  return (
    <div id="patient-profile-page" className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          id="back-to-patients-btn"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition-all active:scale-95 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Back</span>
        </button>

        <button
          id="start-visit-for-patient-btn"
          onClick={() => router.push(`/dashboard/visit/new?patientId=${patient.id}`)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Visit For {patient.name.split(' ')[0]}</span>
        </button>
      </div>

      {/* PATIENT PERSONAL INFO BANNER */}
      <div className="p-6 bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {patient.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                  {patient.displayId}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                {patient.age} years old • {patient.gender} • Registered:{' '}
                {new Date(patient.createdDate).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {patient.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {patient.address}
                </span>
              </div>
            </div>
          </div>

          {/* Outstanding Balance Badge */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-right shrink-0">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Outstanding Balance
            </span>
            <div
              className={`text-2xl font-black mt-1 ${
                patient.outstandingAmount > 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              ₹{patient.outstandingAmount.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {patient.outstandingAmount > 0 ? 'Pending Payment Due' : 'Account Fully Paid'}
            </p>
          </div>
        </div>

        {patient.notes && (
          <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 rounded-2xl text-xs text-amber-800 dark:text-amber-300">
            <span className="font-bold">Doctor Observation Notes: </span>
            {patient.notes}
          </div>
        )}
      </div>

      {/* EYE TEST HISTORY (VISION COMPARISON TABLE) */}
      <div className="p-6 bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-600" />
          Computerized Eye Examination History (Refraction Matrix)
        </h3>

        {patientVisits.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4">No eye examination tests recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700">Date & Visit ID</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-center">Eye</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700">SPH</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700">CYL</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700">AXIS</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700">ADD</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700">PD</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700">Visual Acuity</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700">Diagnosis</th>
                </tr>
              </thead>
              <tbody>
                {patientVisits.map((v) => (
                  <React.Fragment key={v.id}>
                    {/* Right Eye (OD) */}
                    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td rowSpan={2} className="p-2.5 border border-slate-200 dark:border-slate-700 font-mono font-bold text-indigo-600 align-top">
                        {v.date}
                        <br />
                        <span className="text-[10px] text-slate-400 font-normal">{v.displayId}</span>
                      </td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-bold text-blue-600 text-center bg-blue-50/50 dark:bg-blue-950/30">
                        Right (OD)
                      </td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono">{v.visionTest?.rightEye?.sph}</td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono">{v.visionTest?.rightEye?.cyl}</td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono">{v.visionTest?.rightEye?.axis}&deg;</td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono">{v.visionTest?.rightEye?.add}</td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono">{v.visionTest?.rightEye?.pd} mm</td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-bold">{v.visionTest?.rightEye?.va}</td>
                      <td rowSpan={2} className="p-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 align-top">
                        {v.diagnosis}
                      </td>
                    </tr>
                    {/* Left Eye (OS) */}
                    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-bold text-emerald-600 text-center bg-emerald-50/50 dark:bg-emerald-950/30">
                        Left (OS)
                      </td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono">{v.visionTest?.leftEye?.sph}</td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono">{v.visionTest?.leftEye?.cyl}</td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono">{v.visionTest?.leftEye?.axis}&deg;</td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono">{v.visionTest?.leftEye?.add}</td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono">{v.visionTest?.leftEye?.pd} mm</td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-bold">{v.visionTest?.leftEye?.va}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VISIT TIMELINE & PRESCRIPTION HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visit Timeline */}
        <div className="p-6 bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Visit Timeline
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
            {patientVisits.map((v) => (
              <div key={v.id} className="relative group">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-800 shadow-xs"></div>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs font-mono text-indigo-600">{v.displayId}</span>
                    <span className="text-[11px] text-slate-400">{v.date}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Complaint: {v.chiefComplaint}
                  </p>
                  <p className="text-xs text-slate-500">
                    Diagnosis: {v.diagnosis}
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Total: ₹{v.payment?.grandTotal || 0}
                    </span>
                    <button
                      onClick={() => router.push(`/dashboard/visit/${v.id}`)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View Visit Details &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prescription & Order History */}
        <div className="p-6 bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Prescription & Order History
          </h3>

          <div className="space-y-3">
            {patientPrescriptions.map((rx, idx) => (
              <motion.div
                key={rx.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs font-mono text-emerald-600">{rx.displayId}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-semibold">
                      Printed {rx.printedCount}x
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{rx.date}</span>
                </div>

                {rx.frame && (
                  <div className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Glasses className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Frame: {rx.frame.brand} {rx.frame.frameName}</span>
                  </div>
                )}

                {rx.lens && (
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Lens: {rx.lens.brand} ({rx.lens.lensType})
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-xs text-slate-500">
                    Inv #: {rx.payment?.invoiceNumber || 'N/A'}
                  </span>
                  <button
                    onClick={() => router.push(`/dashboard/prescription/${rx.id}`)}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-transform active:scale-95"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print Rx</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

