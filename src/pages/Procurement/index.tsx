import { useState } from "react";

const PRIMARY = "#7B1A1A";

interface ProcurementOrder {
  id: string;
  date: string;
  supplier: string;
  total: number;
  status: "Borrador" | "Pendiente" | "Aprobado" | "Enviado" | "Recibido";
  requester: string;
  costCenter: string;
  items: number;
  lineItems: { name: string; qty: number; unit: string }[];
}

const orders: ProcurementOrder[] = [
  {
    id: "PO-4092",
    date: "12 Oct, 2023",
    supplier: "TechCorp Ind.",
    total: 12450,
    status: "Aprobado",
    requester: "M. Torres",
    costCenter: "IT-OPS-01",
    items: 12,
    lineItems: [
      { name: "Industrial Lubricant XL", qty: 5, unit: "unidades" },
      { name: 'Steel Piping 4"', qty: 12, unit: "unidades" },
      { name: "Welding Rods (Pack 50)", qty: 2, unit: "unidades" },
    ],
  },
  {
    id: "PO-4091",
    date: "10 Oct, 2023",
    supplier: "Global Supplies",
    total: 3200,
    status: "Pendiente",
    requester: "A. Silva",
    costCenter: "OPS-02",
    items: 5,
    lineItems: [
      { name: "Safety Helmets", qty: 20, unit: "unidades" },
      { name: "Safety Gloves", qty: 50, unit: "pares" },
    ],
  },
  {
    id: "PO-4090",
    date: "08 Oct, 2023",
    supplier: "ElectroParts S.A.",
    total: 8900.5,
    status: "Borrador",
    requester: "L. Gómez",
    costCenter: "MNT-01",
    items: 8,
    lineItems: [
      { name: "Copper Wire 2.5mm", qty: 200, unit: "m" },
      { name: "Circuit Breakers", qty: 10, unit: "unidades" },
    ],
  },
];

const steps = [
  "Borrador",
  "Pendiente",
  "Aprobado",
  "Enviado",
  "Recibido",
] as const;

const statusStyles: Record<string, { bg: string; color: string }> = {
  Borrador: { bg: "#F3F4F6", color: "#6B7280" },
  Pendiente: { bg: "#FEF3C7", color: "#92400E" },
  Aprobado: { bg: "#DBEAFE", color: "#1E40AF" },
  Enviado: { bg: "#D1FAE5", color: "#065F46" },
  Recibido: { bg: "#EDE9FE", color: "#5B21B6" },
};

export default function Procurement() {
  const [selected, setSelected] = useState<ProcurementOrder>(orders[0]);
  const [showModal, setShowModal] = useState(false);
  const activeStep = steps.indexOf(selected.status);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Compras
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Supervisa, aprueba y rastrea pedidos de compra.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white">
            Ver pedidos recientes
          </button>
          <button
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors bg-white"
            style={{ color: PRIMARY, borderColor: PRIMARY }}
          >
            Aprobar pedidos
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium"
            style={{ background: PRIMARY }}
          >
            <span className="text-base leading-none">+</span>
            Crear nuevo pedido
          </button>
        </div>
      </div>

      {/* Status Stepper */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => {
            const done = i < activeStep;
            const current = i === activeStep;
            return (
              <div
                key={step}
                className="flex-1 flex flex-col items-center relative"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    className="absolute top-4 left-1/2 right-0 h-0.5 -translate-y-1/2"
                    style={{
                      background: i < activeStep ? PRIMARY : "#E5E7EB",
                      zIndex: 0,
                    }}
                  />
                )}
                {/* Icon circle */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all"
                  style={{
                    background: done || current ? PRIMARY : "#F3F4F6",
                    border: current ? `2px solid ${PRIMARY}` : "none",
                  }}
                >
                  {done ? (
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : current ? (
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                  )}
                </div>
                {/* Label */}
                <div
                  className="text-xs font-medium mt-2"
                  style={{
                    color: current ? PRIMARY : done ? "#374151" : "#9CA3AF",
                  }}
                >
                  {step}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Split panel */}
      <div className="grid grid-cols-3 gap-4">
        {/* Orders Table */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="font-semibold text-gray-900">Pedidos Activos</span>
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  ID
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Fecha
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Proveedor
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Total
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Estado
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Solicitante
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => {
                const s = statusStyles[order.status];
                const isSelected = selected.id === order.id;
                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelected(order)}
                    className={`cursor-pointer transition-colors ${isSelected ? "bg-red-50" : "hover:bg-gray-50"}`}
                  >
                    <td
                      className="px-5 py-4 text-sm font-bold"
                      style={{ color: isSelected ? PRIMARY : "#374151" }}
                    >
                      {order.id}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {order.supplier}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      $
                      {order.total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {order.requester}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detail Side Panel */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-md"
              style={{ background: "#FEF3C7", color: PRIMARY }}
            >
              {selected.id}
            </span>
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
          </div>
          <div className="font-bold text-gray-900 text-lg mb-4">
            {selected.supplier}
          </div>

          <div className="space-y-3 text-sm flex-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Total:</span>
              <span className="font-bold text-gray-900">
                $
                {selected.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Solicitante:</span>
              <span className="font-semibold text-gray-700">
                {selected.requester}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Centro de Costo:</span>
              <span className="font-semibold text-gray-700">
                {selected.costCenter}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Artículos:</span>
              <span className="font-semibold text-gray-700">
                {selected.items} items
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Rechazar
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: PRIMARY }}
            >
              Proceder al Envío
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900 text-base">
                  Detalles del Pedido
                </span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-md"
                  style={{ background: "#FEF3C7", color: PRIMARY }}
                >
                  {selected.id}
                </span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Status + Total */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Estado Actual
                </div>
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
                  style={{ background: PRIMARY }}
                >
                  {selected.status.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Total del Pedido
                </div>
                <div className="text-2xl font-bold" style={{ color: PRIMARY }}>
                  $
                  {selected.total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  Proveedor
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {selected.supplier}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  Fecha
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {selected.date}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  Solicitante
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {selected.requester}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  Centro de Costo
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {selected.costCenter}
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-sm font-semibold text-gray-700">
                  Artículos en el pedido
                </span>
              </div>
              <div className="space-y-2">
                {selected.lineItems.map((li, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm text-gray-700">{li.name}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {li.qty} {li.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white"
                style={{ background: PRIMARY }}
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Descargar PDF
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
