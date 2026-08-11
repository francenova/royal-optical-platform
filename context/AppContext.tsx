'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Patient,
  Visit,
  Medicine,
  Prescription,
  ActivityLog,
  Expense,
  ClinicSettings,
  NavigationPage,
} from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { mapPatient, mapVisit, mapPrescription, mapMedicine, mapActivityLog, mapExpense, mapClinicSettings, appToDbRow } from '@/lib/supabase/mappers';

// ── Default settings (used as fallback while the DB row loads) ──────────────
const DEFAULT_CLINIC_SETTINGS: ClinicSettings = {
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
};

// ── Toast type (unchanged) ──────────────────────────────────────────────────
export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export interface HistoryEntry {
  page: NavigationPage;
  params?: {
    patientId?: string;
    visitId?: string;
    prescriptionId?: string;
    draft?: Partial<Visit>;
  };
}

export const getPageTitle = (page: NavigationPage): string => {
  switch (page) {
    case 'dashboard':
      return 'Dashboard';
    case 'patients':
      return 'Patients';
    case 'patient-profile':
      return 'Patient Profile';
    case 'patient-visit':
      return 'Visit & Eye Test';
    case 'prescription':
      return 'Prescription';
    case 'inventory':
      return 'Medicines & Frames';
    case 'reports':
      return 'Reports & Analytics';
    case 'settings':
      return 'Settings';
    default:
      return 'Dashboard';
  }
};

// ── Context interface (100 % backwards-compatible) ──────────────────────────
interface AppContextType {
  settings: ClinicSettings;
  patients: Patient[];
  visits: Visit[];
  prescriptions: Prescription[];
  medicines: Medicine[];
  activities: ActivityLog[];
  expenses: Expense[];

  activePage: NavigationPage;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  selectedVisitId: string | null;
  selectedPrescriptionId: string | null;
  activeVisitDraft: Partial<Visit> | null;

  canGoBack: boolean;
  previousPageTitle: string | null;
  navigationHistory: HistoryEntry[];

  toasts: ToastItem[];
  isGlobalSearchOpen: boolean;
  globalSearchQuery: string;

  isLoading: boolean;

  // Actions
  navigateTo: (
    page: NavigationPage,
    params?: {
      patientId?: string;
      visitId?: string;
      prescriptionId?: string;
      draft?: Partial<Visit>;
    },
    options?: { skipHistory?: boolean }
  ) => void;
  goBack: () => void;

  setGlobalSearchOpen: (open: boolean) => void;
  setGlobalSearchQuery: (query: string) => void;

  addPatient: (patientData: Omit<Patient, 'id' | 'displayId' | 'createdDate' | 'lastVisitDate' | 'outstandingAmount'>) => Promise<Patient>;
  updatePatient: (id: string, data: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => void;

  updateVisitDraft: (draft: Partial<Visit>) => void;
  clearVisitDraft: () => void;

  updateVisit: (visitId: string, data: Partial<Visit>) => void;
  deleteVisit: (visitId: string) => void;
  deletePrescription: (prescriptionId: string) => void;

  addMedicine: (medData: Omit<Medicine, 'id'>) => Promise<Medicine>;
  updateMedicine: (id: string, data: Partial<Medicine>) => Promise<void>;
  deleteMedicine: (id: string) => void;
  issueMedicineStock: (idOrName: string, qtyToDeduct: number) => void;

  addExpense: (expenseData: Omit<Expense, 'id'>) => Promise<void>;
  updateSettings: (newSettings: Partial<ClinicSettings>) => Promise<void>;

  addToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  resetAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ── Supabase helper — single shared browser client ──────────────────────────
function getSupabase() {
  return createClient();
}

// ── Provider ────────────────────────────────────────────────────────────────
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const supabase = getSupabase();

  // ── React-Query: read all tables ──────────────────────────────────────────

  const patientsQuery = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase.from('patients').select('*').order('created_date', { ascending: false });
      if (error) throw error;
      return (data || []).map((r: Record<string, unknown>) => mapPatient(r));
    },
  });

  const visitsQuery = useQuery({
    queryKey: ['visits'],
    queryFn: async () => {
      const { data, error } = await supabase.from('visits').select('*').order('date', { ascending: false });
      if (error) throw error;
      return (data || []).map((r: Record<string, unknown>) => mapVisit(r));
    },
  });

  const prescriptionsQuery = useQuery({
    queryKey: ['prescriptions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('prescriptions').select('*').order('date', { ascending: false });
      if (error) throw error;
      return (data || []).map((r: Record<string, unknown>) => mapPrescription(r));
    },
  });

  const medicinesQuery = useQuery({
    queryKey: ['medicines'],
    queryFn: async () => {
      const { data, error } = await supabase.from('medicines').select('*').order('name', { ascending: true });
      if (error) throw error;
      return (data || []).map((r: Record<string, unknown>) => mapMedicine(r));
    },
  });

  const activitiesQuery = useQuery({
    queryKey: ['activity_log'],
    queryFn: async () => {
      const { data, error } = await supabase.from('activity_log').select('*').order('timestamp', { ascending: false }).limit(100);
      if (error) throw error;
      return (data || []).map((r: Record<string, unknown>) => mapActivityLog(r));
    },
  });

  const expensesQuery = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false });
      if (error) throw error;
      return (data || []).map((r: Record<string, unknown>) => mapExpense(r));
    },
  });

  const settingsQuery = useQuery({
    queryKey: ['clinic_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('clinic_settings').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      if (!data) return DEFAULT_CLINIC_SETTINGS;
      return mapClinicSettings(data as Record<string, unknown>);
    },
  });

  // ── Derived data arrays ───────────────────────────────────────────────────
  const patients: Patient[] = patientsQuery.data || [];
  
  const visits: Visit[] = (visitsQuery.data || []).map(v => {
    const p = patients.find(pat => pat.id === v.patientId);
    return {
      ...v,
      patientName: v.patientName || p?.name || 'Unknown Patient',
      patientAge: v.patientAge || p?.age || 0,
      patientGender: v.patientGender || p?.gender || 'Other',
      patientPhone: v.patientPhone || p?.phone || '',
      patientAddress: v.patientAddress || p?.address || '',
    };
  });

  const prescriptions: Prescription[] = (prescriptionsQuery.data || []).map(rx => {
    const p = patients.find(pat => pat.id === rx.patientId);
    return {
      ...rx,
      patientName: rx.patientName || p?.name || 'Unknown Patient',
      patientAge: rx.patientAge || p?.age || 0,
      patientGender: rx.patientGender || p?.gender || 'Other',
      patientPhone: rx.patientPhone || p?.phone || '',
      patientAddress: rx.patientAddress || p?.address || '',
    };
  });
  const medicines: Medicine[] = medicinesQuery.data || [];
  const activities: ActivityLog[] = activitiesQuery.data || [];
  const expenses: Expense[] = expensesQuery.data || [];
  const settings: ClinicSettings = settingsQuery.data || DEFAULT_CLINIC_SETTINGS;

  const isLoading =
    patientsQuery.isLoading ||
    visitsQuery.isLoading ||
    prescriptionsQuery.isLoading ||
    medicinesQuery.isLoading ||
    settingsQuery.isLoading;

  // ── Navigation state (client-only, not persisted) ─────────────────────────
  const [activePage, setActivePage] = useState<NavigationPage>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null);
  const [activeVisitDraft, setActiveVisitDraft] = useState<Partial<Visit> | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<HistoryEntry[]>([]);

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isGlobalSearchOpen, setGlobalSearchOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // ── Toasts ────────────────────────────────────────────────────────────────
  const addToast = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newToast: ToastItem = { id, title, message, type };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const navigateTo = (
    page: NavigationPage,
    params?: {
      patientId?: string;
      visitId?: string;
      prescriptionId?: string;
      draft?: Partial<Visit>;
    },
    options?: { skipHistory?: boolean }
  ) => {
    if (!options?.skipHistory && (page !== activePage || params?.patientId !== selectedPatientId)) {
      setNavigationHistory((prev) => [
        ...prev,
        {
          page: activePage,
          params: {
            patientId: selectedPatientId || undefined,
            visitId: selectedVisitId || undefined,
            prescriptionId: selectedPrescriptionId || undefined,
          },
        },
      ]);
    }

    setActivePage(page);
    if (params?.patientId !== undefined) setSelectedPatientId(params.patientId);
    if (params?.visitId !== undefined) setSelectedVisitId(params.visitId);
    if (params?.prescriptionId !== undefined) setSelectedPrescriptionId(params.prescriptionId);
    if (params?.draft !== undefined) setActiveVisitDraft(params.draft);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const newHistory = [...navigationHistory];
      const previous = newHistory.pop()!;
      setNavigationHistory(newHistory);

      setActivePage(previous.page);
      if (previous.params?.patientId !== undefined) setSelectedPatientId(previous.params.patientId);
      if (previous.params?.visitId !== undefined) setSelectedVisitId(previous.params.visitId);
      if (previous.params?.prescriptionId !== undefined) setSelectedPrescriptionId(previous.params.prescriptionId);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activePage !== 'dashboard') {
      setActivePage('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canGoBack = navigationHistory.length > 0 || activePage !== 'dashboard';
  const previousPageTitle =
    navigationHistory.length > 0
      ? getPageTitle(navigationHistory[navigationHistory.length - 1].page)
      : activePage !== 'dashboard'
      ? 'Dashboard'
      : null;

  const updateVisitDraft = useCallback((draft: Partial<Visit>) => {
    setActiveVisitDraft((prev) => ({ ...prev, ...draft }));
  }, []);

  const clearVisitDraft = () => {
    setActiveVisitDraft(null);
  };

  // ── Helper: log activity to Supabase ──────────────────────────────────────
  const logActivity = async (act: Omit<ActivityLog, 'id'>) => {
    const row = appToDbRow(act as Record<string, unknown>);
    await supabase.from('activity_log').insert(row);
    queryClient.invalidateQueries({ queryKey: ['activity_log'] });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ── PATIENTS ──────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  const addPatient = async (
    patientData: Omit<Patient, 'id' | 'displayId' | 'createdDate' | 'lastVisitDate' | 'outstandingAmount'>
  ): Promise<Patient> => {
    // Build optimistic patient (id will be replaced by DB uuid on refetch)
    const tempId = 'temp-' + Date.now();
    const newPatient: Patient = {
      ...patientData,
      id: tempId,
      displayId: 'Pending...',
      createdDate: new Date().toISOString(),
      outstandingAmount: 0,
    };

    try {
      const row = appToDbRow({
        name: patientData.name,
        age: patientData.age,
        gender: patientData.gender,
        phone: patientData.phone,
        email: patientData.email || null,
        address: patientData.address,
        notes: patientData.notes || null,
        createdDate: new Date().toISOString(),
        outstandingAmount: 0,
      } as Record<string, unknown>);

      const { error } = await supabase.from('patients').insert(row);
      if (error) {
        addToast('Error', `Failed to add patient: ${error.message}`, 'error');
        return newPatient;
      }

      await logActivity({
        timestamp: new Date().toISOString(),
        type: 'patient',
        title: 'New Patient Registered',
        description: `Registered ${patientData.name} (${patientData.phone})`,
        patientName: patientData.name,
        amount: 0,
      });

      queryClient.invalidateQueries({ queryKey: ['patients'] });
    } catch (err) {
      addToast('Error', 'Failed to save patient.', 'error');
    }

    addToast('Patient Registered', `${newPatient.name} registered successfully.`);
    return newPatient;
  };

  const updatePatient = async (id: string, data: Partial<Patient>): Promise<void> => {
    try {
      const row = appToDbRow(data as Record<string, unknown>);
      const { error } = await supabase.from('patients').update(row).eq('id', id);
      if (error) {
        addToast('Error', `Failed to update patient: ${error.message}`, 'error');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      addToast('Patient Updated', `Record for patient saved successfully.`);
    } catch {
      addToast('Error', 'Failed to update patient.', 'error');
    }
  };

  const deletePatient = (id: string) => {
    const patientToDelete = patients.find((p) => p.id === id);
    (async () => {
      try {
        await supabase.from('activity_log').delete().eq('patient_id', id);
        await supabase.from('prescriptions').delete().eq('patient_id', id);
        await supabase.from('visits').delete().eq('patient_id', id);
        const { error } = await supabase.from('patients').delete().eq('id', id);
        if (error) {
          addToast('Error', `Failed to delete patient: ${error.message}`, 'error');
          return;
        }
        queryClient.invalidateQueries({ queryKey: ['patients'] });
        queryClient.invalidateQueries({ queryKey: ['visits'] });
        queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
        queryClient.invalidateQueries({ queryKey: ['activity_log'] });
      } catch {
        addToast('Error', 'Failed to delete patient.', 'error');
      }
    })();
    addToast('Patient Removed', `Deleted ${patientToDelete?.name || id} from database.`, 'warning');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ── VISITS & PRESCRIPTIONS ────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════


  const updateVisit = async (visitId: string, data: Partial<Visit>): Promise<void> => {
    try {
      // Strip denormalized patient fields — the visits table only has patient_id
      const {
        patientName: _pn, patientAge: _pa, patientGender: _pg,
        patientPhone: _pp, patientAddress: _paddr,
        ...dataForDb
      } = data as Record<string, unknown>;
      const row = appToDbRow(dataForDb);
      const { error } = await supabase.from('visits').update(row).eq('id', visitId);
      if (error) {
        addToast('Error', `Failed to update visit: ${error.message}`, 'error');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      
      // Also update the corresponding prescription if payment/medicines changed
      if (data.payment || data.medicines || data.visionTest || data.diagnosis || data.doctorNotes) {
        const rxRow = appToDbRow(dataForDb);
        await supabase.from('prescriptions').update(rxRow).eq('visit_id', visitId);
        queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      }
      addToast('Visit Updated', `Updated visit details.`);
    } catch {
      addToast('Error', 'Failed to update visit.', 'error');
    }
  };

  const deleteVisit = async (visitId: string): Promise<void> => {
    try {
      const { error } = await supabase.from('visits').delete().eq('id', visitId);
      if (error) {
        addToast('Error', `Failed to delete visit: ${error.message}`, 'error');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      addToast('Visit Deleted', 'The visit has been permanently removed.', 'warning');
    } catch {
      addToast('Error', 'Failed to delete visit.', 'error');
    }
  };

  const deletePrescription = async (prescriptionId: string): Promise<void> => {
    try {
      const { error } = await supabase.from('prescriptions').delete().eq('id', prescriptionId);
      if (error) {
        addToast('Error', `Failed to delete prescription: ${error.message}`, 'error');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      addToast('Prescription Deleted', 'The prescription has been permanently removed.', 'warning');
    } catch {
      addToast('Error', 'Failed to delete prescription.', 'error');
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ── MEDICINES ─────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  const addMedicine = async (medData: Omit<Medicine, 'id'>): Promise<Medicine> => {
    const tempId = 'temp-' + Date.now();
    const newMed: Medicine = {
      ...medData,
      id: tempId,
    };

    try {
      const row = appToDbRow(medData as Record<string, unknown>);
      delete row['id'];
      const { error } = await supabase.from('medicines').insert(row);
      if (error) {
        addToast('Error', `Failed to add medicine: ${error.message}`, 'error');
        return newMed;
      }

      await logActivity({
        timestamp: new Date().toISOString(),
        type: 'inventory',
        title: 'New Medicine Added',
        description: `Added ${medData.name} (${medData.availableStock} in stock)`,
      });

      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    } catch {
      addToast('Error', 'Failed to add medicine.', 'error');
    }

    addToast('Inventory Added', `${medData.name} added to Rack ${medData.rackNumber}`);
    return newMed;
  };

  const updateMedicine = async (id: string, data: Partial<Medicine>): Promise<void> => {
    try {
      const row = appToDbRow(data as Record<string, unknown>);
      const { error } = await supabase.from('medicines').update(row).eq('id', id);
      if (error) {
        addToast('Error', `Failed to update medicine: ${error.message}`, 'error');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      addToast('Inventory Updated', `Stock record updated.`);
    } catch {
      addToast('Error', 'Failed to update medicine.', 'error');
    }
  };

  const deleteMedicine = async (id: string): Promise<void> => {
    const med = medicines.find((m) => m.id === id);
    try {
      const { error } = await supabase.from('medicines').delete().eq('id', id);
      if (error) {
        addToast('Error', `Failed to delete medicine: ${error.message}`, 'error');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      addToast('Medicine Removed', `Removed ${med?.name || id} from inventory.`, 'warning');
    } catch {
      addToast('Error', 'Failed to delete medicine.', 'error');
    }
  };

  const issueMedicineStock = async (idOrName: string, qtyToDeduct: number): Promise<void> => {
    const matchingMed = medicines.find(
      (med) =>
        med.id === idOrName ||
        med.name.toLowerCase().trim() === idOrName.toLowerCase().trim() ||
        med.name.toLowerCase().includes(idOrName.toLowerCase())
    );

    if (!matchingMed) {
      addToast('Not Found', `Medicine "${idOrName}" not found in inventory.`, 'warning');
      return;
    }

    const newQty = Math.max(0, matchingMed.availableStock - qtyToDeduct);

    try {
      const { error } = await supabase
        .from('medicines')
        .update({ available_stock: newQty })
        .eq('id', matchingMed.id);
      if (error) {
        addToast('Error', `Failed to update stock: ${error.message}`, 'error');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    } catch {
      addToast('Error', 'Failed to deduct stock.', 'error');
    }

    addToast('Stock Issued', `Deducted ${qtyToDeduct} units from ${matchingMed.name}. Remaining live stock updated.`);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ── EXPENSES ──────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  const addExpense = async (expenseData: Omit<Expense, 'id'>): Promise<void> => {
    try {
      const row = appToDbRow(expenseData as Record<string, unknown>);
      delete row['id'];
      const { error } = await supabase.from('expenses').insert(row);
      if (error) {
        addToast('Error', `Failed to log expense: ${error.message}`, 'error');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      addToast('Expense Logged', `Recorded ₹${expenseData.amount} for ${expenseData.description}`);
    } catch {
      addToast('Error', 'Failed to log expense.', 'error');
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ── SETTINGS ──────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  const updateSettings = async (newSettings: Partial<ClinicSettings>): Promise<void> => {
    // Optimistic: update the query cache immediately
    queryClient.setQueryData(['clinic_settings'], (old: ClinicSettings | undefined) => ({
      ...(old || DEFAULT_CLINIC_SETTINGS),
      ...newSettings,
    }));

    try {
      const row = appToDbRow(newSettings as Record<string, unknown>);
      const { error } = await supabase.from('clinic_settings').update(row).eq('id', 1);
      if (error) {
        // If row doesn't exist, try insert
        if (error.code === 'PGRST116' || error.message.includes('No rows')) {
           const insertRow = { ...row, id: 1 };
           await supabase.from('clinic_settings').insert(insertRow);
        } else {
          addToast('Error', `Failed to save settings: ${error.message}`, 'error');
          queryClient.invalidateQueries({ queryKey: ['clinic_settings'] });
          return;
        }
      }
      queryClient.invalidateQueries({ queryKey: ['clinic_settings'] });
      addToast('Settings Saved', 'Clinic configuration updated globally.');
    } catch {
      addToast('Error', 'Failed to save settings.', 'error');
      queryClient.invalidateQueries({ queryKey: ['clinic_settings'] });
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BULK OPERATIONS ───────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  const resetAllData = () => {
    (async () => {
      try {
        // Delete in order that respects foreign keys
        await supabase.from('prescriptions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('visits').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('activity_log').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('expenses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('medicines').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('patients').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        // Reset settings to defaults
        const row = appToDbRow(DEFAULT_CLINIC_SETTINGS as unknown as Record<string, unknown>);
        await supabase.from('clinic_settings').update(row).eq('id', 1);

        // Invalidate all queries
        queryClient.invalidateQueries();
        addToast('Data Reset', 'Cleared all data and restored default settings.', 'info');
      } catch (err) {
        addToast('Error', 'Failed to reset data.', 'error');
      }
    })();
  };

  const exportDataJSON = (): string => {
    return JSON.stringify(
      {
        settings,
        patients,
        visits,
        prescriptions,
        medicines,
        activities,
        expenses,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.patients && parsed.medicines) {
        // Fire async upserts
        (async () => {
          try {
            if (parsed.patients?.length) {
              for (const p of parsed.patients) {
                const row = appToDbRow(p as Record<string, unknown>);
                await supabase.from('patients').upsert(row);
              }
            }
            if (parsed.medicines?.length) {
              for (const m of parsed.medicines) {
                const row = appToDbRow(m as Record<string, unknown>);
                await supabase.from('medicines').upsert(row);
              }
            }
            if (parsed.visits?.length) {
              for (const v of parsed.visits) {
                const row = appToDbRow(v as Record<string, unknown>);
                await supabase.from('visits').upsert(row);
              }
            }
            if (parsed.prescriptions?.length) {
              for (const rx of parsed.prescriptions) {
                const row = appToDbRow(rx as Record<string, unknown>);
                await supabase.from('prescriptions').upsert(row);
              }
            }
            if (parsed.expenses?.length) {
              for (const e of parsed.expenses) {
                const row = appToDbRow(e as Record<string, unknown>);
                await supabase.from('expenses').upsert(row);
              }
            }
            if (parsed.settings) {
              const row = appToDbRow(parsed.settings as Record<string, unknown>);
              await supabase.from('clinic_settings').update(row).eq('id', 1);
            }
            queryClient.invalidateQueries();
            addToast('Data Imported', 'Successfully imported clinic database snapshot.');
          } catch (err) {
            addToast('Import Error', 'Some records failed to import.', 'error');
          }
        })();
        return true;
      }
      throw new Error('Invalid schema format');
    } catch {
      addToast('Import Failed', 'Selected JSON file is invalid or corrupt.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        patients,
        visits,
        prescriptions,
        medicines,
        activities,
        expenses,
        activePage,
        selectedPatientId,
        setSelectedPatientId,
        selectedVisitId,
        selectedPrescriptionId,
        activeVisitDraft,
        canGoBack,
        previousPageTitle,
        navigationHistory,
        toasts,
        isGlobalSearchOpen,
        globalSearchQuery,
        isLoading,

        navigateTo,
        goBack,
        setGlobalSearchOpen,
        setGlobalSearchQuery,
        addPatient,
        updatePatient,
        deletePatient,
        updateVisitDraft,
        clearVisitDraft,
        updateVisit,
        deleteVisit,
        deletePrescription,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        issueMedicineStock,
        addExpense,
        updateSettings,
        addToast,
        removeToast,
        resetAllData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
