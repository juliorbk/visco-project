import { useState, type ReactNode } from "react";
import { BuildingOffice2Icon, TruckIcon, ComputerDesktopIcon, CubeIcon, CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const PRIMARY = "#7B1A1A";

interface Supplier {
  id: number;
  name: string;
  category: string;
  contact: string;
  email: string;
  rating: number;
  status: "Total" | "Revisión" | "Inactivo";
  tier: string;
  since: number;
  certifications: { label: string; type: "ok" | "warn" }[];
  history: {
    id: string;
    date: string;
    status: "Completado" | "En Tránsito" | "Procesando";
  }[];
  icon: ReactNode;
}

const suppliers: Supplier[] = [
  {
    id: 1,
    name: "Acme Industrial C.A.",
    category: "Materias Primas",
    contact: "María López",
    email: "m.lopez@acme.com",
    rating: 4.8,
    status: "Total",
    tier: "Proveedor Nivel 1",
    since: 2018,
    certifications: [
      { label: "ISO 9001", type: "ok" },
      { label: "ISO 14001", type: "ok" },
      { label: "Auditoría Anual", type: "warn" },
    ],
    history: [
      { id: "PO-2023-089", date: "12 Oct 2023", status: "Completado" },
      { id: "PO-2023-102", date: "05 Nov 2023", status: "En Tránsito" },
      { id: "PO-2023-115", date: "28 Nov 2023", status: "Procesando" },
    ],
    icon: <BuildingOffice2Icon className="w-5 h-5 text-gray-600" />,
  },
  {
    id: 2,
    name: "Logística Global Express",
    category: "Transporte",
    contact: "Carlos Ruiz",
    email: "logistica@globalex.com",
    rating: 3.2,
    status: "Revisión",
    tier: "Proveedor Nivel 2",
    since: 2020,
    certifications: [{ label: "ISO 9001", type: "ok" }],
    history: [{ id: "PO-2023-090", date: "14 Oct 2023", status: "Completado" }],
    icon: <TruckIcon className="w-5 h-5 text-gray-600" />,
  },
  {
    id: 3,
    name: "TechSolutions Group",
    category: "Servicios IT",
    contact: "Ana Silva",
    email: "asilva@techsol.io",
    rating: 5.0,
    status: "Total",
    tier: "Proveedor Nivel 1",
    since: 2019,
    certifications: [
      { label: "ISO 27001", type: "ok" },
      { label: "SOC 2", type: "ok" },
    ],
    history: [
      { id: "PO-2023-091", date: "20 Oct 2023", status: "Completado" },
      { id: "PO-2023-108", date: "10 Nov 2023", status: "Procesando" },
    ],
    icon: <ComputerDesktopIcon className="w-5 h-5 text-gray-600" />,
  },
  {
    id: 4,
    name: "EcoPack S.A.",
    category: "Empaquetado",
    contact: "Diego Gómez",
    email: "ventas@ecopack.com",
    rating: 4.5,
    status: "Total",
    tier: "Proveedor Nivel 2",
    since: 2021,
    certifications: [{ label: "ISO 14001", type: "ok" }],
    history: [{ id: "PO-2023-095", date: "18 Oct 2023", status: "Completado" }],
    icon: <CubeIcon className="w-5 h-5 text-gray-600" />,
  },
];

const statusConfig: Record<string, { bg: string; color: string; dot: string }> =
  {
    Total: { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
    Revisión: { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
    Inactivo: { bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF" },
  };

const historyStatusConfig: Record<string, { bg: string; color: string }> = {
  Completado: { bg: "#D1FAE5", color: "#065F46" },
  "En Tránsito": { bg: "#DBEAFE", color: "#1E40AF" },
  Procesando: { bg: "#FEF3C7", color: "#92400E" },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={
            star <= Math.floor(rating)
              ? "#F59E0B"
              : star - 0.5 <= rating
                ? "#F59E0B"
                : "#E5E7EB"
          }
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="text-xs font-semibold text-gray-700 ml-0.5">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function Suppliers() {
  const [selected, setSelected] = useState<Supplier>(suppliers[0]);
  const [category, setCategory] = useState("Todas las Categorías");
  const [compliance, setCompliance] = useState("Todos");

  // Simple bar chart data
  const chartData = [
    { month: "ENE", val: 40 },
    { month: "FEB", val: 65 },
    { month: "MAR", val: 55 },
    { month: "ABR", val: 90 },
    { month: "MAY", val: 120 },
    { month: "JUN", val: 140 },
    { month: "JUL", val: 70 },
  ];
  const maxVal = 160;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Directorio de Proveedores
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Gestione sus relaciones comerciales, evalúe el rendimiento y controle
          el cumplimiento normativo.
        </p>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-gray-900">
            Rendimiento Global de Proveedores
          </div>
          <button
            className="text-sm flex items-center gap-1"
            style={{ color: PRIMARY }}
          >
            Ver reporte completo →
          </button>
        </div>
        <div className="flex items-end gap-2" style={{ height: "100px" }}>
          {chartData.map((d, i) => {
            const even = i % 2 === 0;
            return (
              <div
                key={d.month}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full flex gap-0.5 items-end"
                  style={{ height: "80px" }}
                >
                  <div
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${(d.val / maxVal) * 80}px`,
                      background: even ? "#F4BEBE" : PRIMARY,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none"
        >
          <option>Todas las Categorías</option>
          <option>Materias Primas</option>
          <option>Transporte</option>
          <option>Servicios IT</option>
          <option>Empaquetado</option>
        </select>
        <select
          value={compliance}
          onChange={(e) => setCompliance(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none"
        >
          <option value="Todos">Estado de Cumplimiento: Todos</option>
          <option>Total</option>
          <option>Revisión</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white">
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filtros Avanzados
        </button>
      </div>

      {/* Supplier Grid + Detail */}
      <div className="grid grid-cols-3 gap-4">
        {/* Cards */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {suppliers.map((s) => {
            const sc = statusConfig[s.status];
            const isSelected = selected.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelected(s)}
                className="bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md"
                style={{
                  borderColor: isSelected ? PRIMARY : "#F3F4F6",
                  borderWidth: isSelected ? 2 : 1,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span
                    className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: sc.bg, color: sc.color }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: sc.dot }}
                    />
                    {s.status}
                  </span>
                </div>
                <div className="font-bold text-gray-900 text-sm mb-0.5">
                  {s.name}
                </div>
                <div className="text-xs text-gray-400 mb-2">{s.category}</div>
                <StarRating rating={s.rating} />
                <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Contacto: {s.contact}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    {s.email}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-xl border border-gray-100 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="font-semibold text-gray-900 text-sm">
              Detalles del Proveedor
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

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-4">
              <div
                className="w-14 h-14 rounded-full border-2 flex items-center justify-center mb-2"
                style={{ borderColor: PRIMARY }}
              >
                {selected.icon}
              </div>
              <div className="font-bold text-gray-900 text-center">
                {selected.name}
              </div>
              <div className="text-xs text-gray-400 text-center">
                {selected.tier} • Desde {selected.since}
              </div>
            </div>

            {/* Certifications */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Certificaciones Activas
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.certifications.map((cert) => (
                  <span
                    key={cert.label}
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={
                      cert.type === "ok"
                        ? { background: "#D1FAE5", color: "#065F46" }
                        : { background: "#FEF3C7", color: "#92400E" }
                    }
                  >
                    {cert.type === "ok" ? "✓" : "⚠"} {cert.label}
                  </span>
                ))}
              </div>
            </div>

            {/* History */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Historial Reciente
                </div>
                <button className="text-xs" style={{ color: PRIMARY }}>
                  Ver todo
                </button>
              </div>
              <div className="space-y-2">
                {selected.history.map((h) => {
                  const hs = historyStatusConfig[h.status];
                  return (
                    <div
                      key={h.id}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <div>
                        <div className="text-xs font-semibold text-gray-900">
                          {h.id}
                        </div>
                        <div className="text-xs text-gray-400">{h.date}</div>
                      </div>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: hs.bg, color: hs.color }}
                      >
                        {h.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
            <button className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Mensaje
            </button>
            <button
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white"
              style={{ background: PRIMARY }}
            >
              Nueva Orden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
