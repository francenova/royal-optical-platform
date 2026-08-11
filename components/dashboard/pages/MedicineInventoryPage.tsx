'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Medicine } from '@/lib/types';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { exportToExcel } from '@/lib/excelExport';
import {
  Pill,
  Search,
  Plus,
  AlertCircle,
  AlertTriangle,
  Edit2,
  Trash2,
  X,
  Layers,
  Barcode,
  Calendar,
  CheckCircle2,
  Download,
  MinusCircle,
  PackageCheck,
} from 'lucide-react';

export const MedicineInventoryPage: React.FC = () => {
  const { medicines, addMedicine, updateMedicine, deleteMedicine, issueMedicineStock } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);
  const [deletingMedId, setDeletingMedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Issue Stock Modal state
  const [issuingMed, setIssuingMed] = useState<Medicine | null>(null);
  const [issueQtyInput, setIssueQtyInput] = useState<string>('1');
  const issueQty = Math.max(0, parseInt(issueQtyInput, 10) || 0);

  const [formData, setFormData] = useState<Omit<Medicine, 'id'>>({
    name: '',
    brand: '',
    category: 'Eye Drops',
    batchNumber: '',
    expiryDate: '2027-12',
    purchasePrice: 50,
    sellingPrice: 100,
    supplier: 'Sun Pharma Distributors',
    availableStock: 50,
    minimumStock: 15,
    barcode: '890123456789',
    rackNumber: 'A-01',
  });

  const handleOpenAdd = () => {
    setEditingMed(null);
    setFormData({
      name: '',
      brand: '',
      category: 'Eye Drops',
      batchNumber: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: '2027-12',
      purchasePrice: 60,
      sellingPrice: 110,
      supplier: 'Sun Pharma Distributors',
      availableStock: 50,
      minimumStock: 15,
      barcode: `890${Math.floor(100000000 + Math.random() * 900000000)}`,
      rackNumber: 'A-01',
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (m: Medicine) => {
    setEditingMed(m);
    setFormData({
      name: m.name,
      brand: m.brand,
      category: m.category,
      batchNumber: m.batchNumber,
      expiryDate: m.expiryDate,
      purchasePrice: m.purchasePrice,
      sellingPrice: m.sellingPrice,
      supplier: m.supplier,
      availableStock: m.availableStock,
      minimumStock: m.minimumStock,
      barcode: m.barcode,
      rackNumber: m.rackNumber,
    });
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    try {
      if (editingMed) {
        await updateMedicine(editingMed.id, formData);
      } else {
        await addMedicine(formData);
      }
      setIsDrawerOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMedicines = medicines.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.rackNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.barcode.includes(searchTerm);

    const matchStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'low'
        ? m.availableStock <= m.minimumStock && m.availableStock > 0
        : m.availableStock === 0;

    return matchSearch && matchStock;
  });

  const handleExportMeds = () => {
    const medRows = filteredMedicines.map((m) => ({
      'Medicine ID': m.id,
      'Medicine Name': m.name,
      Brand: m.brand,
      Category: m.category,
      'Batch #': m.batchNumber,
      'Expiry Date': m.expiryDate,
      'Rack #': m.rackNumber,
      Supplier: m.supplier,
      'Buy Price (₹)': m.purchasePrice,
      'Sell Price (₹)': m.sellingPrice,
      'Available Stock': m.availableStock,
      'Min Reorder Level': m.minimumStock,
      Barcode: m.barcode,
    }));

    exportToExcel(medRows, 'Medicine_Stock_Register_2026', 'Medicine Inventory');
  };

  return (
    <div id="medicine-inventory-page" className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Pill className="w-7 h-7 text-indigo-600" />
            Medicine & Pharma Inventory
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Realtime stock monitoring, rack locations, batch numbers, and reorder alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-medicine-excel-btn"
            onClick={handleExportMeds}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-xl text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Stock (Excel)</span>
          </button>

          <button
            id="add-medicine-main-btn"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Stock Item</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            id="inventory-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search medicine name, brand, rack number, or barcode..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                stockFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              All Items ({medicines.length})
            </button>
            <button
              onClick={() => setStockFilter('low')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                stockFilter === 'low'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setStockFilter('out')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                stockFilter === 'out'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-4">Medicine Name & Brand</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Batch / Expiry</th>
                <th className="py-3.5 px-4">Rack #</th>
                <th className="py-3.5 px-4">Price (Buy / Sell)</th>
                <th className="py-3.5 px-4">Available Stock</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Pill className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-medium">No matching items in inventory</p>
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((m) => {
                  const isLow = m.availableStock <= m.minimumStock && m.availableStock > 0;
                  const isOut = m.availableStock === 0;

                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                        <div className="text-xs text-slate-500">
                          Brand: {m.brand} • Supplier: {m.supplier}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs font-medium">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                          {m.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs font-mono">
                        <div>{m.batchNumber}</div>
                        <div className="text-slate-400">Exp: {m.expiryDate}</div>
                      </td>
                      <td className="py-4 px-4 font-bold text-xs text-indigo-600 dark:text-indigo-400 font-mono">
                        {m.rackNumber}
                      </td>
                      <td className="py-4 px-4 text-xs">
                        <span className="text-slate-400 text-[10px]">Buy: ₹{m.purchasePrice}</span>
                        <div className="font-bold text-slate-900 dark:text-white">₹{m.sellingPrice}</div>
                      </td>
                      <td className="py-4 px-4 font-bold text-xs">
                        {isOut ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold flex items-center gap-1 w-max">
                            <AlertCircle className="w-3.5 h-3.5" /> Out Of Stock
                          </span>
                        ) : isLow ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold flex items-center gap-1 w-max">
                            <AlertTriangle className="w-3.5 h-3.5" /> {m.availableStock} Left (Low)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                            {m.availableStock} Units
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`issue-med-${m.id}`}
                            onClick={() => {
                              setIssuingMed(m);
                              setIssueQtyInput('1');
                            }}
                            title="Issue / Dispense Stock"
                            className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
                          >
                            <MinusCircle className="w-3.5 h-3.5" />
                            <span>Issue</span>
                          </button>
                          <button
                            id={`edit-med-${m.id}`}
                            onClick={() => handleOpenEdit(m)}
                            title="Edit Stock Details"
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            id={`delete-med-${m.id}`}
                            onClick={() => setDeletingMedId(m.id)}
                            title="Delete Stock Item"
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MEDICINE MODAL */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingMed ? 'Edit Inventory Item' : 'Add New Inventory Stock'}
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Medicine / Item Name *
                </label>
                <input
                  id="med-form-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Moxifloxacin Eye Drops 0.5%"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Brand Name
                  </label>
                  <input
                    id="med-form-brand"
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Moxicip (Cipla)"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    id="med-form-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    <option value="Eye Drops">Eye Drops</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Ointment">Ointment</option>
                    <option value="Capsules">Capsules</option>
                    <option value="Solution">Solution</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Batch #
                  </label>
                  <input
                    id="med-form-batch"
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rack Location
                  </label>
                  <input
                    id="med-form-rack"
                    type="text"
                    value={formData.rackNumber}
                    onChange={(e) => setFormData({ ...formData, rackNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    id="med-form-expiry"
                    type="month"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Available Stock
                  </label>
                  <input
                    id="med-form-stock"
                    type="number"
                    value={formData.availableStock}
                    onChange={(e) => setFormData({ ...formData, availableStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Minimum Reorder Stock
                  </label>
                  <input
                    id="med-form-minstock"
                    type="number"
                    value={formData.minimumStock}
                    onChange={(e) => setFormData({ ...formData, minimumStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Purchase Price (₹)
                  </label>
                  <input
                    id="med-form-buyprice"
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Selling Price (₹)
                  </label>
                  <input
                    id="med-form-sellprice"
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  id="save-medicine-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md transition-all"
                >
                  {isSubmitting ? 'Saving...' : editingMed ? 'Save Changes' : 'Add Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingMedId)}
        title="Remove Medicine from Inventory?"
        message="Are you sure you want to delete this medicine record?"
        confirmLabel="Remove Stock"
        variant="danger"
        onConfirm={() => {
          if (deletingMedId) deleteMedicine(deletingMedId);
        }}
        onCancel={() => setDeletingMedId(null)}
      />

      {/* QUICK ISSUE / DISPENSE STOCK MODAL */}
      {issuingMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MinusCircle className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Issue / Dispense Stock
                </h3>
              </div>
              <button
                onClick={() => setIssuingMed(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {issuingMed.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  Current Available Stock: <span className="font-bold text-emerald-600">{issuingMed.availableStock} units</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity to Issue / Deduct
                </label>
                <input
                  id="issue-stock-qty-input"
                  type="number"
                  min={0}
                  max={issuingMed.availableStock}
                  value={issueQtyInput}
                  onChange={(e) => setIssueQtyInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Stock Before:</span>
                  <span className="font-bold">{issuingMed.availableStock}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Deducting:</span>
                  <span>- {issueQty}</span>
                </div>
                <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-black border-t border-slate-200 dark:border-slate-700 pt-1">
                  <span>Remaining Live Stock:</span>
                  <span>{Math.max(0, issuingMed.availableStock - issueQty)} units</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIssuingMed(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  id="confirm-issue-stock-btn"
                  type="button"
                  onClick={async () => {
                    if (!issuingMed || issueQty <= 0) return;
                    setIsSubmitting(true);
                    try {
                      issueMedicineStock(issuingMed.id, issueQty);
                      setIssuingMed(null);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  {isSubmitting ? 'Processing...' : 'Deduct Live Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
