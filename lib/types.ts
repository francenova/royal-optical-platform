export type Gender = 'Male' | 'Female' | 'Other';

export interface Patient {
  id: string; // uuid
  displayId: string; // e.g., 'PAT-1001'
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email?: string;
  address: string;
  createdDate: string; // ISO date
  lastVisitDate?: string;
  outstandingAmount: number;
  notes?: string;
}

export interface EyeVisionData {
  sph: string; // e.g. -1.50
  cyl: string; // e.g. -0.50
  axis: string; // e.g. 90
  add: string; // e.g. +2.00
  nearCyl?: string; // e.g. -0.50
  nearAxis?: string; // e.g. 90
  pd: string; // e.g. 62
  va: string; // e.g. 6/6
}

export interface VisionTest {
  rightEye: EyeVisionData;
  leftEye: EyeVisionData;
  iopRight?: string;
  iopLeft?: string;
  notes?: string;
}

export interface PrescribedMedicine {
  id: string;
  medicineId: string;
  medicineName: string;
  morning: number;
  afternoon: number;
  night: number;
  days: number;
  totalQty: number;
  unitPrice: number;
  totalPrice: number;
  instructions: string; // e.g. "1 drop 3 times daily"
  inStock: number;
  isLowStock?: boolean;
  isOutOfStock?: boolean;
}

export interface FrameSelection {
  frameId?: string;
  frameName: string;
  brand: string;
  code: string;
  type: 'Full Rim' | 'Half Rim' | 'Rimless' | 'Sunglasses' | 'Other';
  price: number;
  discount: number;
  finalAmount: number;
}

export interface LensSelection {
  // Free-text with suggestions (the form uses an <input list="..."> datalist,
  // not a <select>), so this is deliberately a string rather than a strict
  // union — matches the actual UI behavior.
  lensType: string;
  brand: string;
  index: '1.50' | '1.56' | '1.60 High Index' | '1.67 Polycarbonate' | '1.74 Ultra Thin';
  coating: string;
  blueCut: boolean;
  photochromic: boolean;
  antiGlare: boolean;
  price: number;
}

export interface ContactLensSelection {
  brand: string;
  power: string;
  baseCurve: string;
  diameter: string;
  eye: 'Both' | 'Right (OD)' | 'Left (OS)';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Mixed';

export interface PaymentDetails {
  consultationFee: number;
  medicineTotal: number;
  lensTotal: number;
  frameTotal: number;
  contactLensTotal: number;
  additionalCharges: number;
  discount: number;
  subtotal: number;
  grandTotal: number;
  advance: number;
  balance: number;
  paymentMethod: PaymentMethod;
  invoiceNumber: string; // e.g. 'INV-2026-0042'
  paymentDate: string;
  status: 'Paid' | 'Partial' | 'Pending';
}

export interface Visit {
  id: string; // uuid
  displayId: string; // e.g. 'VIS-5001'
  patientId: string; // uuid
  patientName: string; // mapped from join
  patientAge: number;
  patientGender: Gender;
  patientPhone: string;
  patientAddress: string;
  date: string;
  chiefComplaint: string;
  symptoms: string;
  diagnosis: string;
  visionTest: VisionTest;
  medicines: PrescribedMedicine[];
  contactLens?: ContactLensSelection;
  frame?: FrameSelection;
  lens?: LensSelection;
  doctorNotes: string;
  payment: PaymentDetails;
  status: 'Completed' | 'Pending Delivery' | 'Ready Order' | 'In Progress';
}

export interface Medicine {
  id: string; // uuid
  name: string;
  brand: string;
  category: 'Eye Drops' | 'Tablets' | 'Ointment' | 'Capsules' | 'Solution';
  batchNumber: string;
  expiryDate: string; // YYYY-MM
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  availableStock: number;
  minimumStock: number;
  barcode: string;
  rackNumber: string;
}

export interface Prescription {
  id: string; // uuid
  displayId: string; // e.g. 'RX-8001'
  visitId: string; // uuid
  patientId: string; // uuid
  patientName: string; // mapped from join
  patientAge: number;
  patientGender: Gender;
  patientPhone: string;
  patientAddress: string;
  date: string;
  visionTest: VisionTest;
  diagnosis: string;
  medicines: PrescribedMedicine[];
  contactLens?: ContactLensSelection;
  frame?: FrameSelection;
  lens?: LensSelection;
  doctorNotes: string;
  payment: PaymentDetails;
  printedCount: number;
  lastPrintedAt?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'patient' | 'visit' | 'prescription' | 'medicine' | 'payment' | 'inventory';
  title: string;
  description: string;
  patientName?: string;
  amount?: number;
}

export interface Expense {
  id: string;
  category: 'Optical Supplies' | 'Rent' | 'Utilities' | 'Equipment' | 'Salaries' | 'Marketing' | 'Misc';
  description: string;
  amount: number;
  date: string;
}

export interface ClinicSettings {
  id: number;
  clinicName: string;
  businessTypes: string[];
  address: string;
  phone: string;
  email: string;
  doctorName: string;
  doctorTitle: string;
  credentials?: string;
  registrationNumber: string;
  defaultConsultationFee: number;
  defaultPrinter: string;
  currencySymbol: string;
  currency?: string;
  language?: string;
  logoUrl?: string;
  enableAutoSave: boolean;
  theme: 'light' | 'dark' | 'system';
  updatedAt?: string;
}

export type NavigationPage =
  | 'dashboard'
  | 'patients'
  | 'patient-profile'
  | 'patient-visit'
  | 'prescription'
  | 'inventory'
  | 'reports'
  | 'settings';
