import { useState, useEffect, useCallback } from 'react';

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  status: string;
}

type ModalMode = 'add' | 'edit' | 'delete' | null;

interface InventoryModalProps {
  mode: ModalMode;
  item?: InventoryItem | null;
  onClose: () => void;
  onSave: (item: Omit<InventoryItem, 'id'> & { id?: number }) => void;
  onDelete: (id: number) => void;
}

const CATEGORIES = ['Materials', 'Electrical', 'Safety', 'Tools', 'Equipment'];

function getStatus(stock: number): string {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 50) return 'Low Stock';
  return 'In Stock';
}

const INITIAL_FORM = { name: '', sku: '', category: 'Materials', stock: 0 };

export default function InventoryModal({ mode, item, onClose, onSave, onDelete }: InventoryModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item && (mode === 'edit' || mode === 'delete')) {
      setForm({
        name: item.name,
        sku: item.sku,
        category: item.category,
        stock: item.stock,
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [item, mode]);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, name: e.target.value })),
    []
  );
  const handleSkuChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, sku: e.target.value.toUpperCase() })),
    []
  );
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => setForm((p) => ({ ...p, category: e.target.value })),
    []
  );
  const handleStockChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, stock: parseInt(e.target.value) || 0 })),
    []
  );

  if (!mode) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.sku.trim()) errs.sku = 'SKU is required';
    if (form.stock < 0) errs.stock = 'Stock cannot be negative';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({
      ...(item?.id ? { id: item.id } : {}),
      ...form,
      status: getStatus(form.stock),
    });
    onClose();
  };

  const handleDelete = () => {
    if (item) { onDelete(item.id); onClose(); }
  };

  const isDelete = mode === 'delete';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 rounded-t-xl flex items-center justify-between ${isDelete ? 'bg-red-50 border-b border-red-100' : 'bg-teal-50 border-b border-teal-100'}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDelete ? 'bg-red-100' : 'bg-teal-100'}`}>
              {isDelete ? (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              ) : mode === 'edit' ? (
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </div>
            <h3 className={`text-lg font-semibold ${isDelete ? 'text-red-800' : 'text-teal-800'}`}>
              {mode === 'add' ? 'Add Inventory Item' : mode === 'edit' ? 'Edit Item' : 'Delete Item'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {isDelete ? (
            <div className="text-center py-2">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium text-base mb-1">Are you sure you want to delete</p>
              <p className="text-red-600 font-bold text-lg">"{item?.name}"</p>
              <p className="text-gray-500 text-sm mt-2">This action cannot be undone.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Steel Pipes"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={handleSkuChange}
                  placeholder="e.g. SP-001"
                  className={`w-full px-3 py-2 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${errors.sku ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
              </div>

              {/* Category & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Qty <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleStockChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${errors.stock ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                </div>
              </div>

              {/* Status preview */}
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">Status preview</span>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  getStatus(form.stock) === 'In Stock' ? 'bg-green-100 text-green-800' :
                  getStatus(form.stock) === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {getStatus(form.stock)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          {isDelete ? (
            <button
              onClick={handleDelete}
              className="px-5 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete Item</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-5 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
            >
              {mode === 'add' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Item</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}