import { Patient, Visit, Prescription, Medicine, Expense, ActivityLog, ClinicSettings } from '@/lib/types';

export function dbRowToApp<T = Record<string, unknown>>(row: Record<string, unknown>): T {
  // Generic fallback if needed, but we'll use explicit mappers mostly
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    out[k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = v;
  }
  return out as T;
}

export function mapPatient(row: Record<string, any>): Patient {
  return {
    id: row.id,
    displayId: row.display_id,
    name: row.name,
    age: row.age,
    gender: row.gender,
    phone: row.phone,
    email: row.email,
    address: row.address,
    createdDate: row.created_date,
    lastVisitDate: row.last_visit_date,
    outstandingAmount: row.outstanding_amount,
    notes: row.notes,
  };
}

export function mapVisit(row: Record<string, any>): Visit {
  return {
    id: row.id,
    displayId: row.display_id,
    patientId: row.patient_id,
    date: row.date,
    chiefComplaint: row.chief_complaint,
    symptoms: row.symptoms,
    diagnosis: row.diagnosis,
    visionTest: row.vision_test || {},
    medicines: row.medicines || [],
    contactLens: row.contact_lens,
    frame: row.frame,
    lens: row.lens,
    doctorNotes: row.doctor_notes,
    payment: row.payment || {},
    status: row.status,
    patientName: row.patients?.name || '',
    patientAge: row.patients?.age || 0,
    patientGender: row.patients?.gender || 'Other',
    patientPhone: row.patients?.phone || '',
    patientAddress: row.patients?.address || '',
  };
}

export function mapPrescription(row: Record<string, any>): Prescription {
  return {
    id: row.id,
    displayId: row.display_id,
    visitId: row.visit_id,
    patientId: row.patient_id,
    date: row.date,
    visionTest: row.vision_test || {},
    diagnosis: row.diagnosis,
    medicines: row.medicines || [],
    contactLens: row.contact_lens,
    frame: row.frame,
    lens: row.lens,
    doctorNotes: row.doctor_notes,
    payment: row.payment || {},
    printedCount: row.printed_count,
    lastPrintedAt: row.last_printed_at,
    patientName: row.patients?.name || '',
    patientAge: row.patients?.age || 0,
    patientGender: row.patients?.gender || 'Other',
    patientPhone: row.patients?.phone || '',
    patientAddress: row.patients?.address || '',
  };
}

export function mapMedicine(row: Record<string, any>): Medicine {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    batchNumber: row.batch_number,
    expiryDate: row.expiry_date,
    purchasePrice: row.purchase_price,
    sellingPrice: row.selling_price,
    supplier: row.supplier,
    availableStock: row.available_stock,
    minimumStock: row.minimum_stock,
    barcode: row.barcode,
    rackNumber: row.rack_number,
  };
}

export function mapExpense(row: Record<string, any>): Expense {
  return {
    id: row.id,
    category: row.category,
    description: row.description,
    amount: row.amount,
    date: row.date,
  };
}

export function mapActivityLog(row: Record<string, any>): ActivityLog {
  return {
    id: row.id,
    timestamp: row.timestamp,
    type: row.type,
    title: row.title,
    description: row.description,
    patientName: row.patient_name,
    amount: row.amount,
  };
}

export function mapClinicSettings(row: Record<string, any>): ClinicSettings {
  return {
    id: row.id || 1,
    clinicName: row.clinic_name,
    businessTypes: row.business_types || [],
    address: row.address,
    phone: row.phone,
    email: row.email,
    doctorName: row.doctor_name,
    doctorTitle: row.doctor_title,
    credentials: row.credentials,
    registrationNumber: row.registration_number,
    defaultConsultationFee: row.default_consultation_fee,
    defaultPrinter: row.default_printer,
    currencySymbol: row.currency_symbol,
    currency: row.currency,
    language: row.language,
    logoUrl: row.logo_url,
    enableAutoSave: row.enable_auto_save,
    theme: row.theme,
    updatedAt: row.updated_at,
  };
}

export function appToDbRow(obj: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    // Don't map displayId back to DB on inserts/updates unless explicitly named display_id
    if (k === 'displayId') continue;
    out[k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)] = v;
  }
  return out;
}
