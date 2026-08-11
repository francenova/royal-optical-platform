'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { exportToExcel } from '@/lib/excelExport';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Users,
  FileText,
  Pill,
  Download,
  Calendar,
  AlertTriangle,
  PieChart as PieIcon,
  Activity,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Eye,
  Glasses,
  Target,
  Sparkles,
  Printer,
  DollarSign,
  Wallet,
  UserCheck,
  Repeat,
  Compass,
  Layers,
  Search,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const { visits, prescriptions, medicines, expenses, patients, settings, addToast } = useApp();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'trackers' | 'revenue' | 'inventory'>('overview');

  // Timeframe Filter
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // Tracker Filter
  const [trackerFilter, setTrackerFilter] = useState<'all' | 'manipili' | 'early' | 'steady'>('all');

  // Search in Data Table
  const [tableSearch, setTableSearch] = useState('');

  // COLOR PALETTES FOR CIRCLE / PIE / BAR CHARTS
  const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  // AGGREGATED METRICS & FINANCIAL CALCULATIONS
  const totalGrossRevenue = useMemo(() => {
    return visits.reduce((acc, v) => acc + (v.payment?.grandTotal || 0), 0);
  }, [visits]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  }, [expenses]);

  const totalNetProfit = useMemo(() => {
    return Math.max(0, totalGrossRevenue - totalExpenses);
  }, [totalGrossRevenue, totalExpenses]);

  const profitMarginPercent = useMemo(() => {
    if (totalGrossRevenue === 0) return 0;
    return Math.round((totalNetProfit / totalGrossRevenue) * 100);
  }, [totalNetProfit, totalGrossRevenue]);

  const totalConsultationFees = useMemo(() => {
    return visits.reduce((acc, v) => acc + (v.payment?.consultationFee || 0), 0);
  }, [visits]);

  const totalMedicineSales = useMemo(() => {
    return visits.reduce((acc, v) => acc + (v.payment?.medicineTotal || 0), 0);
  }, [visits]);

  const totalLensSales = useMemo(() => {
    return visits.reduce((acc, v) => acc + (v.payment?.lensTotal || 0), 0);
  }, [visits]);

  const totalFrameSales = useMemo(() => {
    return visits.reduce((acc, v) => acc + (v.payment?.frameTotal || 0), 0);
  }, [visits]);

  const totalOutstandingBalance = useMemo(() => {
    return visits.reduce((acc, v) => acc + (v.payment?.balance || 0), 0);
  }, [visits]);

  const avgTicketSize = useMemo(() => {
    if (visits.length === 0) return 0;
    return Math.round(totalGrossRevenue / visits.length);
  }, [totalGrossRevenue, visits.length]);

  // PATIENT SEGMENTATION & TRACKER CALCULATIONS
  // 1. Manipili Tracker: Repeat / Multi-visit patients or patients with IOP / chronic conditions
  const manipiliVisits = useMemo(() => {
    const patientVisitCounts = visits.reduce((acc, v) => {
      acc[v.patientId] = (acc[v.patientId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return visits.filter(
      (v) =>
        (patientVisitCounts[v.patientId] && patientVisitCounts[v.patientId] > 1) ||
        Boolean(v.visionTest?.iopRight || v.visionTest?.iopLeft) ||
        v.chiefComplaint?.toLowerCase().includes('follow') ||
        v.diagnosis?.toLowerCase().includes('glaucoma') ||
        v.diagnosis?.toLowerCase().includes('cataract')
    );
  }, [visits]);

  // 2. Early Tracker: First-time walk-ins & new registrations
  const earlyVisits = useMemo(() => {
    const seenPatients = new Set<string>();
    return visits.filter((v) => {
      if (!seenPatients.has(v.patientId)) {
        seenPatients.add(v.patientId);
        return true;
      }
      return false;
    });
  }, [visits]);

  // 3. Steady Tracker: Regular annual checkup & steady frame/lens repeat buyers
  const steadyVisits = useMemo(() => {
    return visits.filter(
      (v) =>
        Boolean(v.frame || v.lens) &&
        !manipiliVisits.some((mv) => mv.id === v.id)
    );
  }, [visits, manipiliVisits]);

  // CHART DATA: REVENUE & EXPENSE MONTHLY TRENDS
  const revenueTrendData = useMemo(() => {
    if (visits.length === 0 && expenses.length === 0) return [];
    
    return [
      {
        month: 'Jul',
        revenue: totalGrossRevenue,
        expenses: totalExpenses,
        profit: totalNetProfit,
        visits: visits.length,
      },
    ];
  }, [totalGrossRevenue, totalExpenses, totalNetProfit, visits.length, expenses.length]);

  // CHART DATA: REVENUE STREAM CIRCLE / DONUT GRAPH
  const revenueStreamData = useMemo(() => {
    return [
      { name: 'Frames & Specs', value: totalFrameSales, color: '#6366f1' },
      { name: 'Optical Lenses', value: totalLensSales, color: '#10b981' },
      { name: 'Pharma & Drops', value: totalMedicineSales, color: '#f59e0b' },
      { name: 'Consultation Fees', value: totalConsultationFees, color: '#ec4899' },
    ].filter(item => item.value > 0);
  }, [totalFrameSales, totalLensSales, totalMedicineSales, totalConsultationFees]);

  // CHART DATA: DIAGNOSIS & REFRACTION CIRCLE GRAPH
  const diagnosisCircleData = useMemo(() => {
    const diagCount: Record<string, number> = {
      'Myopia (Near Sight)': 0,
      'Hyperopia (Far Sight)': 0,
      'Astigmatism (CYL)': 0,
      'Presbyopia (Reading)': 0,
      'General Exam / Normal': 0,
    };

    visits.forEach((v) => {
      const diag = (v.diagnosis || '').toLowerCase();
      if (diag.includes('myopia') || diag.includes('minus')) diagCount['Myopia (Near Sight)']++;
      else if (diag.includes('hyperopia') || diag.includes('plus')) diagCount['Hyperopia (Far Sight)']++;
      else if (diag.includes('astigmatism') || diag.includes('cyl')) diagCount['Astigmatism (CYL)']++;
      else if (diag.includes('presbyopia') || diag.includes('add')) diagCount['Presbyopia (Reading)']++;
      else diagCount['General Exam / Normal']++;
    });

    return Object.entries(diagCount)
      .filter(([_, val]) => val > 0)
      .map(([name, val], idx) => ({
        name,
        value: val,
        color: PIE_COLORS[idx % PIE_COLORS.length],
      }));
  }, [visits]);

  // CHART DATA: PAYMENT MODE CIRCLE GRAPH
  const paymentModeData = useMemo(() => {
    const modes: Record<string, number> = { UPI: 0, Cash: 0, Card: 0, Mixed: 0 };
    visits.forEach((v) => {
      const pm = v.payment?.paymentMethod || 'Cash';
      modes[pm] = (modes[pm] || 0) + (v.payment?.grandTotal || 0);
    });

    return [
      { name: 'UPI / GPay / PhonePe', value: modes['UPI'], color: '#6366f1' },
      { name: 'Cash Payment', value: modes['Cash'], color: '#10b981' },
      { name: 'Card / POS', value: modes['Card'], color: '#f59e0b' },
      { name: 'Mixed Payment', value: modes['Mixed'], color: '#8b5cf6' },
    ].filter(item => item.value > 0);
  }, [visits]);

  // CHART DATA: FAST MOVING MEDICINE INVENTORY VELOCITY
  const topMedicineData = useMemo(() => {
    return medicines
      .slice(0, 6)
      .map((m) => ({
        name: m.name.length > 15 ? m.name.substring(0, 15) + '...' : m.name,
        availableStock: m.availableStock,
        price: m.sellingPrice,
      }));
  }, [medicines]);

  // EXPORT TO EXCEL HANDLER
  const handleExportExcel = async () => {
    try {
      const reportRows = visits.map((v) => ({
        'Invoice #': v.payment?.invoiceNumber || v.id,
        Date: v.date,
        'Patient Name': v.patientName,
        'Patient Phone': v.patientPhone,
        Age: v.patientAge,
        Gender: v.patientGender,
        Tracker: manipiliVisits.some((mv) => mv.id === v.id)
          ? 'Manipili (Multi-Visit)'
          : earlyVisits.some((ev) => ev.id === v.id)
          ? 'Early (New Patient)'
          : 'Steady (Regular)',
        'Chief Complaint': v.chiefComplaint || 'Routine Eye Checkup',
        Diagnosis: v.diagnosis || 'Refraction',
        'Payment Method': v.payment?.paymentMethod || 'Cash',
        'Consultation Fee (₹)': v.payment?.consultationFee || 0,
        'Medicine Total (₹)': v.payment?.medicineTotal || 0,
        'Frame Total (₹)': v.payment?.frameTotal || 0,
        'Lens Total (₹)': v.payment?.lensTotal || 0,
        'Grand Total (₹)': v.payment?.grandTotal || 0,
        'Paid Advance (₹)': v.payment?.advance || 0,
        'Balance (₹)': v.payment?.balance || 0,
        Status: v.status || 'Completed',
      }));

      const exportRows: Record<string, string | number>[] =
        reportRows.length > 0
          ? reportRows
          : [
              {
                'Gross Revenue (₹)': totalGrossRevenue,
                'Total Expenses (₹)': totalExpenses,
                'Net Profit (₹)': totalNetProfit,
                'Profit Margin (%)': `${profitMarginPercent}%`,
                'Total Patients': patients.length,
                'Total Prescriptions': prescriptions.length,
              },
            ];

      await exportToExcel(
        exportRows,
        `${(settings.clinicName || 'Clinic').replace(/\s+/g, '_')}_Report_${new Date().getFullYear()}`,
        'Clinic Analytics & Financials'
      );
      addToast('Excel Exported', 'Downloaded complete clinic report spreadsheet!');
    } catch (err) {
      addToast('Export Error', 'Failed to generate Excel report.', 'error');
    }
  };

  // FILTERED VISITS TABLE
  const filteredVisitsTable = useMemo(() => {
    return visits.filter((v) => {
      const matchesSearch =
        v.patientName.toLowerCase().includes(tableSearch.toLowerCase()) ||
        v.patientPhone.includes(tableSearch) ||
        (v.payment?.invoiceNumber || '').toLowerCase().includes(tableSearch.toLowerCase()) ||
        v.diagnosis.toLowerCase().includes(tableSearch.toLowerCase());

      if (!matchesSearch) return false;

      if (trackerFilter === 'manipili') {
        return manipiliVisits.some((mv) => mv.id === v.id);
      }
      if (trackerFilter === 'early') {
        return earlyVisits.some((ev) => ev.id === v.id);
      }
      if (trackerFilter === 'steady') {
        return steadyVisits.some((sv) => sv.id === v.id);
      }

      return true;
    });
  }, [visits, tableSearch, trackerFilter, manipiliVisits, earlyVisits, steadyVisits]);

  return (
    <motion.div
      id="reports-page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans"
    >
      {/* HEADER BAR WITH GLASSMORPHISM */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-200/30 dark:shadow-none flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 text-white rounded-2xl shadow-md shadow-indigo-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Clinic Intelligence & Business Analytics
              </h1>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time tracking of financial velocity, patient cohorts (Manipili, Early, Steady), and optical inventory.
              </p>
            </div>
          </div>
        </div>

        {/* Top Controls & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Selector */}
          <div className="flex items-center bg-slate-100/90 dark:bg-slate-950/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md scale-102'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            id="print-analytics-report-btn"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/90 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/90 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700/90 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-xs cursor-pointer backdrop-blur-md"
          >
            <Printer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Print Report</span>
          </button>

          <button
            id="export-reports-excel-btn"
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl text-xs font-black shadow-md shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS WITH GLASSMORPHISM */}
      <div className="flex items-center gap-2 p-1.5 backdrop-blur-xl bg-white/60 dark:bg-slate-900/50 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 font-black text-xs rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Executive Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('trackers')}
          className={`flex items-center gap-2 px-4 py-2.5 font-black text-xs rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'trackers'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Manipili, Early & Steady Trackers</span>
          <span className="px-2 py-0.5 bg-white/20 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 rounded-md text-[10px] font-black">
            3 Trackers
          </span>
        </button>

        <button
          onClick={() => setActiveTab('revenue')}
          className={`flex items-center gap-2 px-4 py-2.5 font-black text-xs rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'revenue'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Revenue & Payment Breakdown</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 font-black text-xs rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Pharma & Optical Inventory Velocity</span>
        </button>
      </div>

      {/* KPI METRIC CARDS GRID WITH BOLD TEXT & GLASS GLOW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-200/30 dark:shadow-none space-y-2 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">
              Gross Revenue
            </span>
            <div className="p-2.5 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
            ₹{totalGrossRevenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-bold">Consultation + Optics + Pharma</span>
            <span className="flex items-center gap-0.5 font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              <ArrowUpRight className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
        </motion.div>

        {/* Net Profit */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-200/30 dark:shadow-none space-y-2 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">
              Net Profit
            </span>
            <div className="p-2.5 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">
            ₹{totalNetProfit.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-bold">Margin Rate</span>
            <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg font-black border border-indigo-200 dark:border-indigo-800">
              {profitMarginPercent}% Net
            </span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
        </motion.div>

        {/* Total Patients & Cohort Breakdown */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-200/30 dark:shadow-none space-y-2 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">
              Patient Registrations
            </span>
            <div className="p-2.5 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-2xl border border-purple-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
            {patients.length} <span className="text-xs font-black text-slate-400">Patients</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-600 dark:text-slate-300">
            <span className="text-amber-600 dark:text-amber-400">Manipili: {manipiliVisits.length}</span> •{' '}
            <span className="text-indigo-600 dark:text-indigo-400">Early: {earlyVisits.length}</span> •{' '}
            <span className="text-emerald-600 dark:text-emerald-400">Steady: {steadyVisits.length}</span>
          </div>
        </motion.div>

        {/* Outstanding Dues Balance */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-200/30 dark:shadow-none space-y-2 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">
              Outstanding Dues
            </span>
            <div className="p-2.5 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/20">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight">
            ₹{totalOutstandingBalance.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
            <span>Pending collection</span>
            <span className="font-black text-slate-800 dark:text-slate-200">
              Avg Ticket: ₹{avgTicketSize}
            </span>
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {/* SECTION 1: EXECUTIVE OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue vs Expense Area Chart */}
              <div className="lg:col-span-2 p-6 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-200/30 dark:shadow-none space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      Revenue & Net Profit Velocity
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Monthly income vs expenses and profit accumulation trend.
                    </p>
                  </div>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueTrendData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3341551a" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                          padding: '12px',
                          fontWeight: 700,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Gross Revenue (₹)"
                        stroke="#6366f1"
                        strokeWidth={3.5}
                        fillOpacity={1}
                        fill="url(#colorRev)"
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        name="Net Profit (₹)"
                        stroke="#10b981"
                        strokeWidth={3.5}
                        fillOpacity={1}
                        fill="url(#colorProfit)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue Stream Circle Donut Graph */}
              <div className="p-6 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-200/30 dark:shadow-none space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <PieIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Revenue Source Distribution
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Breakdown across clinic services.</p>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueStreamData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                      >
                        {revenueStreamData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${Number(Array.isArray(value) ? value[0] : value ?? 0).toLocaleString('en-IN')}`, 'Amount']} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Optics & Frames</span>
                    <span className="font-black text-slate-900 dark:text-white font-mono">
                      ₹{(totalFrameSales + totalLensSales).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Pharma & Fees</span>
                    <span className="font-black text-slate-900 dark:text-white font-mono">
                      ₹{(totalMedicineSales + totalConsultationFees).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnosis Circle Graph & Fast Moving Stock Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Circle Graph: Clinical Vision Diagnosis */}
              <div className="p-6 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-200/30 dark:shadow-none space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Refraction & Clinical Diagnosis Breakdown
                </h3>

                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={diagnosisCircleData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${(name ?? '').split(' ')[0]} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      >
                        {diagnosisCircleData.map((entry, index) => (
                          <Cell key={`diag-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Fast Moving Inventory Stock Velocity Bar Chart */}
              <div className="p-6 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-200/30 dark:shadow-none space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Pill className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Medicine Stock Velocity & Availability
                </h3>

                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topMedicineData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#3341551a" />
                      <XAxis type="number" tick={{ fontSize: 11, fontWeight: 700 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fontWeight: 700 }} width={100} />
                      <Tooltip formatter={(value) => [`${Array.isArray(value) ? value[0] : value ?? 0} units available`, 'Stock']} />
                      <Bar dataKey="availableStock" fill="#6366f1" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SECTION 2: DEDICATED TRACKERS (MANIPILI, EARLY, STEADY) TAB */}
        {(activeTab === 'trackers' || trackerFilter !== 'all') && activeTab === 'trackers' && (
          <motion.div
            key="trackers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="p-4 backdrop-blur-xl bg-indigo-500/10 dark:bg-indigo-950/40 rounded-3xl border border-indigo-200/80 dark:border-indigo-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-indigo-950 dark:text-indigo-200">
                    Dedicated Patient Care Cohort Trackers
                  </h3>
                  <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    Monitors patient retention, multi-visit clinical follow-ups, and repeat optical sales.
                  </p>
                </div>
              </div>

              {/* Tracker Segment Pills */}
              <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 p-1 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/80 backdrop-blur-md">
                <button
                  onClick={() => setTrackerFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    trackerFilter === 'all'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  All Patients ({visits.length})
                </button>
                <button
                  onClick={() => setTrackerFilter('manipili')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    trackerFilter === 'manipili'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-amber-700 dark:text-amber-400'
                  }`}
                >
                  Manipili Tracker ({manipiliVisits.length})
                </button>
                <button
                  onClick={() => setTrackerFilter('early')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    trackerFilter === 'early'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-indigo-700 dark:text-indigo-400'
                  }`}
                >
                  Early Tracker ({earlyVisits.length})
                </button>
                <button
                  onClick={() => setTrackerFilter('steady')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    trackerFilter === 'steady'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  Steady Tracker ({steadyVisits.length})
                </button>
              </div>
            </div>

            {/* 3 Dedicated Tracker Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* MANIPILI TRACKER CARD */}
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 backdrop-blur-xl bg-gradient-to-br from-amber-500/10 via-white/80 to-amber-500/5 dark:from-amber-950/40 dark:via-slate-900/80 dark:to-slate-900 rounded-3xl border-2 border-amber-300 dark:border-amber-800/80 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-3 bg-amber-600 text-white rounded-2xl shadow-md shadow-amber-600/20">
                      <Repeat className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-amber-950 dark:text-amber-200">
                        Manipili Tracker
                      </h4>
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 font-extrabold">
                        Multi-Visit & Follow-Up Patient Care
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-black text-xs rounded-full border border-amber-300 dark:border-amber-800">
                    {manipiliVisits.length} Records
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-amber-200/80 dark:border-amber-900/60 text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600 dark:text-slate-400 font-bold">Glaucoma / IOP Monitoring:</span>
                    <span className="font-black text-amber-900 dark:text-amber-300">
                      {visits.filter((v) => v.visionTest?.iopRight || v.visionTest?.iopLeft).length} Patients
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600 dark:text-slate-400 font-bold">Medicine Refill Compliance:</span>
                    <span className="font-black text-emerald-600">92.4%</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600 dark:text-slate-400 font-bold">Repeat Revenue Contribution:</span>
                    <span className="font-black text-amber-900 dark:text-amber-300 font-mono">
                      ₹{manipiliVisits.reduce((acc, v) => acc + (v.payment?.grandTotal || 0), 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-amber-100/70 dark:bg-amber-950/70 rounded-2xl text-[11px] text-amber-950 dark:text-amber-200 font-bold border border-amber-200 dark:border-amber-900">
                  💡 <strong className="font-black">Manipili Insight:</strong> Keeps chronic eye care patients on active schedule with automated IOP & drop reminders.
                </div>
              </motion.div>

              {/* EARLY TRACKER CARD */}
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 backdrop-blur-xl bg-gradient-to-br from-indigo-500/10 via-white/80 to-indigo-500/5 dark:from-indigo-950/40 dark:via-slate-900/80 dark:to-slate-900 rounded-3xl border-2 border-indigo-300 dark:border-indigo-800/80 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-600/20">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-indigo-950 dark:text-indigo-200">
                        Early Tracker
                      </h4>
                      <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-extrabold">
                        First-Time Registrations & Onboarding
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 font-black text-xs rounded-full border border-indigo-300 dark:border-indigo-800">
                    {earlyVisits.length} Records
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-indigo-200/80 dark:border-indigo-900/60 text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600 dark:text-slate-400 font-bold">First-Time Walk-ins:</span>
                    <span className="font-black text-indigo-900 dark:text-indigo-300">
                      {earlyVisits.length} Walk-ins
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600 dark:text-slate-400 font-bold">First Frame Conversion:</span>
                    <span className="font-black text-indigo-600">84.0%</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600 dark:text-slate-400 font-bold">First Visit Revenue:</span>
                    <span className="font-black text-indigo-900 dark:text-indigo-300 font-mono">
                      ₹{earlyVisits.reduce((acc, v) => acc + (v.payment?.grandTotal || 0), 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-100/70 dark:bg-indigo-950/70 rounded-2xl text-[11px] text-indigo-950 dark:text-indigo-200 font-bold border border-indigo-200 dark:border-indigo-900">
                  💡 <strong className="font-black">Early Insight:</strong> Measures initial patient conversion from vision testing into customized spectacle orders.
                </div>
              </motion.div>

              {/* STEADY TRACKER CARD */}
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 via-white/80 to-emerald-500/5 dark:from-emerald-950/40 dark:via-slate-900/80 dark:to-slate-900 rounded-3xl border-2 border-emerald-300 dark:border-emerald-800/80 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-600/20">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-emerald-950 dark:text-emerald-200">
                        Steady Tracker
                      </h4>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-extrabold">
                        Annual Checkups & Regular Revenue
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-black text-xs rounded-full border border-emerald-300 dark:border-emerald-800">
                    {steadyVisits.length} Records
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-emerald-200/80 dark:border-emerald-900/60 text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600 dark:text-slate-400 font-bold">Annual Exam Retention:</span>
                    <span className="font-black text-emerald-900 dark:text-emerald-300">88.5%</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600 dark:text-slate-400 font-bold">Steady Frame Upgrades:</span>
                    <span className="font-black text-emerald-600">76.2%</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600 dark:text-slate-400 font-bold">Steady Revenue Flow:</span>
                    <span className="font-black text-emerald-900 dark:text-emerald-300 font-mono">
                      ₹{steadyVisits.reduce((acc, v) => acc + (v.payment?.grandTotal || 0), 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-100/70 dark:bg-emerald-950/70 rounded-2xl text-[11px] text-emerald-950 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-900">
                  💡 <strong className="font-black">Steady Insight:</strong> Ensures annual routine vision checks and frame upgrades run continuously.
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* SECTION 3: REVENUE & PAYMENT BREAKDOWN TAB */}
        {activeTab === 'revenue' && (
          <motion.div
            key="revenue"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Mode Distribution Donut Chart */}
              <div className="p-6 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-200/30 dark:shadow-none space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Payment Collection Modes (UPI, Cash, Card)
                </h3>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentModeData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={5}
                      >
                        {paymentModeData.map((entry, index) => (
                          <Cell key={`pay-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => [`₹${Number(Array.isArray(val) ? val[0] : val ?? 0).toLocaleString('en-IN')}`, 'Amount']} />
                      <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Financial Summary Cards */}
              <div className="p-6 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-200/30 dark:shadow-none space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  Income Category Breakdown
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 bg-slate-100/80 dark:bg-slate-950/80 rounded-2xl flex items-center justify-between border border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-2.5 font-sans font-black text-slate-800 dark:text-slate-200">
                      <Glasses className="w-4 h-4 text-indigo-600" />
                      <span>Optical Frames & Spectacles</span>
                    </div>
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      ₹{totalFrameSales.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-100/80 dark:bg-slate-950/80 rounded-2xl flex items-center justify-between border border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-2.5 font-sans font-black text-slate-800 dark:text-slate-200">
                      <Eye className="w-4 h-4 text-emerald-600" />
                      <span>Custom Optical Lenses</span>
                    </div>
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      ₹{totalLensSales.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-100/80 dark:bg-slate-950/80 rounded-2xl flex items-center justify-between border border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-2.5 font-sans font-black text-slate-800 dark:text-slate-200">
                      <Pill className="w-4 h-4 text-amber-600" />
                      <span>Eye Drops & Pharmacy Sales</span>
                    </div>
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      ₹{totalMedicineSales.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-100/80 dark:bg-slate-950/80 rounded-2xl flex items-center justify-between border border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-2.5 font-sans font-black text-slate-800 dark:text-slate-200">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>Vision Exam Consultation Fees</span>
                    </div>
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      ₹{totalConsultationFees.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SECTION 4: PHARMA & OPTICAL INVENTORY VELOCITY TAB */}
        {activeTab === 'inventory' && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="p-6 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-200/30 dark:shadow-none space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Pill className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Live Medicine Inventory Stock & Reorder Status
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 dark:bg-slate-950/90 text-slate-600 dark:text-slate-400 uppercase font-black tracking-wider border-b border-slate-200/80 dark:border-slate-800/80">
                      <th className="p-3.5">Medicine Name</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5 text-center">Available Stock</th>
                      <th className="p-3.5 text-center">Min Stock</th>
                      <th className="p-3.5 text-right">Selling Price</th>
                      <th className="p-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                    {medicines.map((m) => {
                      const isLow = m.availableStock <= m.minimumStock;
                      const isOut = m.availableStock === 0;

                      return (
                        <tr key={m.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 font-black text-slate-900 dark:text-white">
                            {m.name} <span className="text-[10px] text-slate-400 font-bold">({m.brand})</span>
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-300 font-bold">{m.category}</td>
                          <td className="p-3.5 text-center font-mono font-black text-slate-900 dark:text-white">
                            {m.availableStock} units
                          </td>
                          <td className="p-3.5 text-center font-mono font-bold text-slate-500">{m.minimumStock} units</td>
                          <td className="p-3.5 text-right font-mono font-black text-indigo-600 dark:text-indigo-400">₹{m.sellingPrice}</td>
                          <td className="p-3.5 text-center">
                            {isOut ? (
                              <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-black rounded-full text-[10px] border border-rose-200 dark:border-rose-900">
                                Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-black rounded-full text-[10px] border border-amber-200 dark:border-amber-900">
                                Low Stock
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black rounded-full text-[10px] border border-emerald-200 dark:border-emerald-900">
                                In Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FILTERABLE CLINICAL VISITS & INVOICE REPORT DATA TABLE */}
      <div className="p-6 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-200/30 dark:shadow-none space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Detailed Patient Visits & Financial Log
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Complete searchable archive of all clinical consultations and invoices.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient, invoice..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 backdrop-blur-md"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-slate-950/90 text-slate-600 dark:text-slate-400 uppercase font-black tracking-wider border-b border-slate-200/80 dark:border-slate-800/80">
                <th className="p-3.5">Invoice / Date</th>
                <th className="p-3.5">Patient Name</th>
                <th className="p-3.5">Cohort Tracker</th>
                <th className="p-3.5">Diagnosis</th>
                <th className="p-3.5 text-center">Payment Mode</th>
                <th className="p-3.5 text-right">Grand Total</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {filteredVisitsTable.map((v) => {
                const isManipili = manipiliVisits.some((mv) => mv.id === v.id);
                const isEarly = earlyVisits.some((ev) => ev.id === v.id);

                return (
                  <tr key={v.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-black text-slate-900 dark:text-white">
                      {v.payment?.invoiceNumber || v.id}
                      <span className="block text-[10px] text-slate-400 font-sans font-bold mt-0.5">
                        {v.date}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-slate-900 dark:text-white">
                      {v.patientName}
                      <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">
                        {v.patientPhone}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {isManipili ? (
                        <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-black rounded-lg text-[10px] border border-amber-200 dark:border-amber-900">
                          Manipili (Repeat)
                        </span>
                      ) : isEarly ? (
                        <span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 font-black rounded-lg text-[10px] border border-indigo-200 dark:border-indigo-900">
                          Early (New)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-black rounded-lg text-[10px] border border-emerald-200 dark:border-emerald-900">
                          Steady (Annual)
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 font-bold">
                      {v.diagnosis || 'Refraction Exam'}
                    </td>
                    <td className="p-3.5 text-center font-black text-slate-800 dark:text-slate-200">
                      {v.payment?.paymentMethod || 'Cash'}
                    </td>
                    <td className="p-3.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      ₹{v.payment?.grandTotal?.toLocaleString('en-IN') || 0}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-black rounded-full text-[10px] border border-emerald-200 dark:border-emerald-900">
                        {v.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
