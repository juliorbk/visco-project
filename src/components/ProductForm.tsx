import { useState, useEffect } from "react";
import type { ProductRequest, ProductResponse, SupplierOption, CategoryOption } from "../index";
import { UOM_LABELS } from "../utils/labels";

const UOM_OPTIONS = Object.entries(UOM_LABELS) as [string, string][];

interface ProductFormProps {
  initial?: ProductResponse | null;
  suppliers: SupplierOption[];
  categories: CategoryOption[];
  onSubmit: (data: ProductRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const EMPTY: ProductRequest = {
  name: "",
  sku: "",
  description: "",
  sapCode: "",
  uom: "UNIDAD",
  reorderPoint: 0,
  supplier: { id: 0 },
  category: { id: 0 },
};

export default function ProductForm({ initial, suppliers, categories, onSubmit, onCancel, loading }: ProductFormProps) {
  const [form, setForm] = useState<ProductRequest>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductRequest | "supplierId" | "categoryId", string>>>({});

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        sku: initial.sku,
        description: initial.description,
        sapCode: initial.sapCode,
        uom: initial.uom,
        reorderPoint: initial.reorderPoint,
        supplier: { id: initial.supplierId },
        category: { id: initial.categoryId },
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [initial]);

  const set = (field: keyof ProductRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (field === "supplier") setForm((f) => ({ ...f, supplier: { id: Number(val) } }));
    else if (field === "category") setForm((f) => ({ ...f, category: { id: Number(val) } }));
    else if (field === "reorderPoint") setForm((f) => ({ ...f, reorderPoint: Number(val) }));
    else setForm((f) => ({ ...f, [field]: val }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const er: typeof errors = {};
    if (!form.name.trim()) er.name = "El nombre es obligatorio";
    if (!form.sku.trim()) er.sku = "El SKU es obligatorio";
    if (!form.sapCode.trim()) er.sapCode = "El código SAP es obligatorio";
    if (!form.supplier.id) er.supplierId = "Selecciona un proveedor";
    if (!form.category.id) er.categoryId = "Selecciona una categoría";
    if (form.reorderPoint < 0) er.reorderPoint = "Debe ser ≥ 0";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition ${
      errors[field as keyof typeof errors] ? "border-red-400 bg-red-50 focus:ring-red-200" : "border-gray-200 focus:ring-red-100 focus:border-red-400"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name + SKU */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nombre *</label>
          <input className={inputClass("name")} value={form.name} onChange={set("name")} placeholder="Ej. Válvula Industrial" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">SKU *</label>
          <input className={inputClass("sku")} value={form.sku} onChange={set("sku")} placeholder="Ej. VAL-001" />
          {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Descripción</label>
        <textarea className={`${inputClass("description")} resize-none`} rows={3} value={form.description} onChange={set("description")} placeholder="Descripción del producto..." />
      </div>

      {/* SAP Code + UOM */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Código SAP *</label>
          <input className={inputClass("sapCode")} value={form.sapCode} onChange={set("sapCode")} placeholder="Ej. MAT-00123" />
          {errors.sapCode && <p className="text-red-500 text-xs mt-1">{errors.sapCode}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Unidad de Medida</label>
          <select className={inputClass("uom")} value={form.uom} onChange={set("uom")}>
            {UOM_OPTIONS.map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reorder point */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Punto de Reorden</label>
        <input type="number" min="0" className={inputClass("reorderPoint")} value={form.reorderPoint} onChange={set("reorderPoint")} />
        {errors.reorderPoint && <p className="text-red-500 text-xs mt-1">{errors.reorderPoint}</p>}
      </div>

      {/* Supplier + Category */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Proveedor *</label>
          <select className={inputClass("supplierId")} value={form.supplier.id || ""} onChange={set("supplier")}>
            <option value="">Seleccionar…</option>
            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {errors.supplierId && <p className="text-red-500 text-xs mt-1">{errors.supplierId}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Categoría *</label>
          <select className={inputClass("categoryId")} value={form.category.id || ""} onChange={set("category")}>
            <option value="">Seleccionar…</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: loading ? "#9CA3AF" : "#7B1A1A" }}
        >
          {loading ? "Guardando…" : initial ? "Guardar Cambios" : "Crear Producto"}
        </button>
      </div>
    </form>
  );
}
