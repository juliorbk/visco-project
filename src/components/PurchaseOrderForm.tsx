import { useState } from "react";
import type {
  PurchaseOrderRequest,
  PurchaseOrderItemRequest,
  SupplierOption,
  ProductResponse,
} from "../index";
import { PAYMENT_METHOD_LABELS, ORDER_TYPE_LABELS } from "../utils/labels";

const PRIMARY = "#7B1A1A";

interface PurchaseOrderFormProps {
  suppliers: SupplierOption[];
  products: ProductResponse[];
  onSubmit: (data: PurchaseOrderRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const EMPTY_ITEM: PurchaseOrderItemRequest = { productId: 0, quantity: 1, unitPrice: 0 };

export default function PurchaseOrderForm({
  suppliers,
  products,
  onSubmit,
  onCancel,
  loading,
}: PurchaseOrderFormProps) {
  const [form, setForm] = useState({
    orderNumber: "",
    description: "",
    supplierId: 0,
    paymentMethod: "CASH" as PurchaseOrderRequest["paymentMethod"],
    type: "MATERIALS" as PurchaseOrderRequest["type"],
  });
  const [items, setItems] = useState<PurchaseOrderItemRequest[]>([{ ...EMPTY_ITEM }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [field]: field === "supplierId" ? Number(val) : val }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  const setItem = (index: number, field: keyof PurchaseOrderItemRequest, value: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: field === "productId" ? Number(value) : Number(value),
      };
      return next;
    });
  };

  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const total = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  const validate = () => {
    const er: Record<string, string> = {};
    if (!form.orderNumber.trim()) er.orderNumber = "El número de orden es obligatorio";
    if (!form.description.trim()) er.description = "La descripción es obligatoria";
    if (!form.supplierId) er.supplierId = "Selecciona un proveedor";
    if (items.some((i) => !i.productId)) er.items = "Selecciona un producto en todos los ítems";
    if (items.some((i) => i.quantity < 1)) er.items = "La cantidad debe ser ≥ 1";
    if (items.some((i) => i.unitPrice <= 0)) er.items = "El precio unitario debe ser > 0";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ ...form, items });
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 focus:ring-red-100 focus:border-red-300"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Order number + description */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">N° de Orden *</label>
          <input className={inputClass("orderNumber")} value={form.orderNumber} onChange={setField("orderNumber")} placeholder="Ej. PO-2024-001" />
          {errors.orderNumber && <p className="text-red-500 text-xs mt-1">{errors.orderNumber}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Proveedor *</label>
          <select className={inputClass("supplierId")} value={form.supplierId || ""} onChange={setField("supplierId")}>
            <option value="">Seleccionar…</option>
            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {errors.supplierId && <p className="text-red-500 text-xs mt-1">{errors.supplierId}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Descripción *</label>
        <textarea className={`${inputClass("description")} resize-none`} rows={2} value={form.description} onChange={setField("description")} placeholder="Descripción breve de la orden…" />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Payment + Type */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Método de Pago</label>
          <select className={inputClass("paymentMethod")} value={form.paymentMethod} onChange={setField("paymentMethod")}>
            {Object.entries(PAYMENT_METHOD_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tipo de Orden</label>
          <select className={inputClass("type")} value={form.type} onChange={setField("type")}>
            {Object.entries(ORDER_TYPE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-600">Ítems de la Orden *</label>
          <button type="button" onClick={addItem} className="text-xs font-semibold flex items-center gap-1" style={{ color: PRIMARY }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
            Agregar ítem
          </button>
        </div>

        <div className="space-y-2">
          {/* Header row */}
          <div className="grid gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide" style={{ gridTemplateColumns: "1fr 80px 100px 28px" }}>
            <span>Producto</span><span>Cantidad</span><span>Precio Unit.</span><span />
          </div>

          {items.map((item, i) => (
            <div key={i} className="grid gap-2 items-center" style={{ gridTemplateColumns: "1fr 80px 100px 28px" }}>
              <select
                className="px-2.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300"
                value={item.productId || ""}
                onChange={(e) => setItem(i, "productId", e.target.value)}
              >
                <option value="">Seleccionar…</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
              </select>
              <input
                type="number" min="1"
                className="px-2.5 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-red-100"
                value={item.quantity}
                onChange={(e) => setItem(i, "quantity", e.target.value)}
              />
              <input
                type="number" min="0" step="0.01"
                className="px-2.5 py-2 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-red-100"
                value={item.unitPrice}
                onChange={(e) => setItem(i, "unitPrice", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                disabled={items.length === 1}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
        {errors.items && <p className="text-red-500 text-xs mt-2">{errors.items}</p>}

        {/* Total */}
        <div className="mt-3 flex justify-end">
          <div className="text-right">
            <div className="text-xs text-gray-400">Total estimado</div>
            <div className="text-xl font-bold" style={{ color: PRIMARY }}>
              ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: loading ? "#9CA3AF" : PRIMARY }}
        >
          {loading ? "Creando…" : "Crear Orden"}
        </button>
      </div>
    </form>
  );
}
