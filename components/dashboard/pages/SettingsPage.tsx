'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import {
  Building2,
  Palette,
  Database,
  Upload,
  Download,
  RotateCcw,
  Globe,
  Sun,
  Moon,
  Trash2,
  CheckCircle2,
  X,
  FileJson,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    exportDataJSON,
    importDataJSON,
    resetAllData,
    addToast,
  } = useApp();

  const [formData, setFormData] = useState({
    clinicName: settings.clinicName || 'VisionCare Eye Clinic',
    doctorName: settings.doctorName || 'Dr. R. Kumar',
    credentials: settings.credentials || settings.doctorTitle || 'MBBS, MS Ophthalmology',
    registrationNumber: settings.registrationNumber || 'DMC-12345',
    phone: settings.phone || '+91 98110 22345',
    email: settings.email || 'hello@visioncare.clinic',
    address: settings.address || 'Sector 21, Noida',
    defaultConsultationFee: settings.defaultConsultationFee ?? 500,
    currency: settings.currency || 'INR (₹)',
    language: settings.language || 'English',
    theme: settings.theme || 'light',
    logoUrl: settings.logoUrl || '',
    defaultPrinter: settings.defaultPrinter || 'Thermal HP LaserJet Pro 400',
  });

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Sync form data when settings change in context
  useEffect(() => {
    setFormData({
      clinicName: settings.clinicName || 'VisionCare Eye Clinic',
      doctorName: settings.doctorName || 'Dr. R. Kumar',
      credentials: settings.credentials || settings.doctorTitle || 'MBBS, MS Ophthalmology',
      registrationNumber: settings.registrationNumber || 'DMC-12345',
      phone: settings.phone || '+91 98110 22345',
      email: settings.email || 'hello@visioncare.clinic',
      address: settings.address || 'Sector 21, Noida',
      defaultConsultationFee: settings.defaultConsultationFee ?? 500,
      currency: settings.currency || 'INR (₹)',
      language: settings.language || 'English',
      theme: settings.theme || 'light',
      logoUrl: settings.logoUrl || '',
      defaultPrinter: settings.defaultPrinter || 'Thermal HP LaserJet Pro 400',
    });
  }, [settings]);

  // Handle Logo Upload — uses Supabase Storage
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast('File Too Large', 'Please upload an image smaller than 2MB.', 'warning');
      return;
    }

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const fileExt = file.name.split('.').pop() || 'png';
      const filePath = `logo-${Date.now()}.${fileExt}`;

      // Remove old logo file if it exists
      if (formData.logoUrl) {
        const oldPath = formData.logoUrl.split('/clinic-assets/').pop();
        if (oldPath) {
          await supabase.storage.from('clinic-assets').remove([oldPath]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('clinic-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        addToast('Upload Failed', uploadError.message, 'error');
        return;
      }

      const { data: urlData } = supabase.storage
        .from('clinic-assets')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, logoUrl: urlData.publicUrl }));
      addToast('Logo Selected', 'Logo uploaded. Click "Save Changes" to apply.');
    } catch {
      addToast('Upload Failed', 'Could not upload logo. Please try again.', 'error');
    }
  };

  const handleRemoveLogo = async () => {
    if (formData.logoUrl) {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const oldPath = formData.logoUrl.split('/clinic-assets/').pop();
        if (oldPath) {
          await supabase.storage.from('clinic-assets').remove([oldPath]);
        }
      } catch {
        // Non-critical — the URL will just be cleared
      }
    }
    setFormData((prev) => ({ ...prev, logoUrl: '' }));
  };

  // Form submit handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      clinicName: formData.clinicName,
      doctorName: formData.doctorName,
      credentials: formData.credentials,
      doctorTitle: formData.credentials,
      registrationNumber: formData.registrationNumber,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      defaultConsultationFee: Number(formData.defaultConsultationFee) || 0,
      currency: formData.currency,
      language: formData.language,
      theme: formData.theme as 'light' | 'dark',
      logoUrl: formData.logoUrl,
      defaultPrinter: formData.defaultPrinter,
    });
    addToast('Settings Saved', 'Clinic configuration updated successfully.', 'success');
  };

  // Immediate Theme Switch
  const handleToggleTheme = () => {
    const nextTheme = formData.theme === 'dark' ? 'light' : 'dark';
    setFormData((prev) => ({ ...prev, theme: nextTheme }));
    updateSettings({ theme: nextTheme });
    addToast(
      'Appearance Changed',
      `Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode.`,
      'info'
    );
  };

  // Export JSON Backup
  const handleBackupData = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinic_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Backup Downloaded', 'Saved complete clinic dataset backup JSON file.');
  };

  // Restore JSON Backup
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          addToast('Database Restored', 'Successfully restored clinic records from JSON file.');
        }
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  return (
    <div id="settings-page" className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6 font-sans">
      {/* 1. CLINIC INFORMATION SECTION */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Clinic Information
            </h2>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
            {/* Clinic Name */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1.5 font-bold">
                Clinic Name
              </label>
              <input
                id="setting-clinic-name"
                type="text"
                required
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                placeholder="VisionCare Eye Clinic"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Doctor Name */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1.5 font-bold">
                Doctor Name
              </label>
              <input
                id="setting-doctor-name"
                type="text"
                required
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                placeholder="Dr. R. Kumar"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Credentials */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1.5 font-bold">
                Credentials
              </label>
              <input
                id="setting-credentials"
                type="text"
                value={formData.credentials}
                onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                placeholder="MBBS, MS Ophthalmology"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Registration No */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1.5 font-bold">
                Registration No.
              </label>
              <input
                id="setting-registration-no"
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                placeholder="DMC-12345"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1.5 font-bold">
                Phone
              </label>
              <input
                id="setting-phone"
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98110 22345"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1.5 font-bold">
                Email
              </label>
              <input
                id="setting-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="hello@visioncare.clinic"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1.5 font-bold">
                Address
              </label>
              <input
                id="setting-address"
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Sector 21, Noida"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Consultation Fee */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1.5 font-bold">
                Consultation Fee (₹)
              </label>
              <input
                id="setting-consultation-fee"
                type="number"
                value={formData.defaultConsultationFee}
                onChange={(e) => setFormData({ ...formData, defaultConsultationFee: parseFloat(e.target.value) || 0 })}
                placeholder="500"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Clinic Logo Section */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Clinic Logo
            </label>

            {formData.logoUrl ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={formData.logoUrl}
                    alt="Clinic Logo Preview"
                    className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-slate-200 dark:border-slate-700 shadow-xs"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Uploaded Logo Active</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Appears on prescriptions, bills, and main header.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer transition-colors">
                    Change Logo
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-colors cursor-pointer"
                    title="Remove Logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl bg-white dark:bg-slate-950/50 cursor-pointer group transition-all">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-xs font-semibold">Click to upload logo (PNG/SVG/JPG)</span>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              id="save-settings-submit-btn"
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>

      {/* 2. PREFERENCES SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-6">
        {/* Section Header */}
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
          <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Preferences
          </h2>
        </div>

        {/* Currency & Language Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
          {/* Currency Dropdown */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1.5 font-bold">
              Currency
            </label>
            <select
              id="setting-currency"
              value={formData.currency}
              onChange={(e) => {
                setFormData({ ...formData, currency: e.target.value });
                updateSettings({ currency: e.target.value });
              }}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="INR (₹)">INR (₹)</option>
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
              <option value="AED (د.إ)">AED (د.إ)</option>
              <option value="CAD ($)">CAD ($)</option>
              <option value="AUD ($)">AUD ($)</option>
            </select>
          </div>

          {/* Language Dropdown */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1.5 font-bold">
              Language
            </label>
            <select
              id="setting-language"
              value={formData.language}
              onChange={(e) => {
                setFormData({ ...formData, language: e.target.value });
                updateSettings({ language: e.target.value });
              }}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="Arabic">Arabic</option>
              <option value="Bengali">Bengali</option>
              <option value="Marathi">Marathi</option>
            </select>
          </div>
        </div>

        {/* Appearance Toggle Row */}
        <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Appearance — {formData.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>

          {/* Smooth Interactive Pill Switch */}
          <button
            id="theme-toggle-switch"
            type="button"
            onClick={handleToggleTheme}
            className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              formData.theme === 'dark' ? 'bg-blue-600' : 'bg-slate-300'
            }`}
            role="switch"
            aria-checked={formData.theme === 'dark'}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                formData.theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              {formData.theme === 'dark' ? (
                <Moon className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* 3. DATA & BACKUP SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-6">
        {/* Section Header */}
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
          <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Data & Backup
          </h2>
        </div>

        {/* 4 Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 1. Backup Data */}
          <button
            id="backup-data-btn"
            type="button"
            onClick={handleBackupData}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Backup Data</span>
          </button>

          {/* 2. Restore Data */}
          <label className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-2xs active:scale-95">
            <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Restore Data</span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreFile}
              className="hidden"
            />
          </label>

          {/* 3. Export Database */}
          <button
            id="export-database-btn"
            type="button"
            onClick={handleBackupData}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Export Database</span>
          </button>

          {/* 4. Import Database */}
          <label className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-2xs active:scale-95">
            <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Import Database</span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreFile}
              className="hidden"
            />
          </label>

          {/* Reset Dataset Option */}
          <button
            id="reset-sample-data-btn"
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset Dataset</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Resetting */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset All Clinic Data?"
        message="This will overwrite local database records and permanently clear all patients, visits, and medicines, restoring only default settings."
        confirmLabel="Reset All Data"
        variant="danger"
        onConfirm={resetAllData}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
