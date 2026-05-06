import { useState } from "react";

const PRIMARY = "#7B1A1A";
const PRIMARY_LIGHT = "#FDF0F0";
const PRIMARY_MED = "#C5504A";

// Simple bar chart component
function BarChart() {
  const data = [
    { month: "Jul", real: 65, proj: 90 },
    { month: "Ago", real: 75, proj: 110 },
    { month: "Sep", real: 85, proj: 120 },
    { month: "Oct", real: 90, proj: 140 },
    { month: "Nov", real: 165, proj: 200 },
    { month: "Dic", real: 160, proj: 185 },
  ];
  const max = 220;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-semibold text-gray-900 text-base">
            Gastos vs Proyecciones
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            Rendimiento Q3 2023
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ background: PRIMARY }}
            />
            Real
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ background: "#F4BEBE" }}
            />
            Proyectado
          </span>
        </div>
      </div>
      <div className="flex-1 flex items-end gap-2 relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 w-10">
          <span>$300k</span>
          <span>$200k</span>
          <span>$100k</span>
          <span>$0</span>
        </div>
        {/* Bars */}
        <div className="flex-1 flex items-end gap-2 ml-10 pb-8 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 pb-8 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="border-t border-gray-100 w-full" />
            ))}
          </div>
          {data.map((d) => (
            <div
              key={d.month}
              className="flex-1 flex flex-col items-center gap-0.5 relative"
            >
              <div
                className="w-full flex gap-0.5 items-end"
                style={{ height: "140px" }}
              >
                {/* Projected (behind) */}
                <div
                  className="flex-1 rounded-sm opacity-60 transition-all"
                  style={{
                    height: `${(d.proj / max) * 140}px`,
                    background: "#F4BEBE",
                  }}
                />
                {/* Real (front) */}
                <div
                  className="flex-1 rounded-sm transition-all"
                  style={{
                    height: `${(d.real / max) * 140}px`,
                    background: PRIMARY,
                  }}
                />
              </div>
              <div className="absolute -bottom-6 text-xs text-gray-400 whitespace-nowrap">
                {d.month}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Donut chart for expense breakdown
function DonutChart() {
  return (
    <div className="flex flex-col h-full">
      <div className="font-semibold text-gray-900 text-base mb-4">
        Desglose de Gastos
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Simple circle representation */}
        <div className="relative w-28 h-28 mb-4">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="3"
            />
            {/* 45% Componentes */}
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke={PRIMARY}
              strokeWidth="3"
              strokeDasharray="45 55"
              strokeDashoffset="0"
            />
            {/* 30% Equipos */}
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#F4BEBE"
              strokeWidth="3"
              strokeDasharray="30 70"
              strokeDashoffset="-45"
            />
            {/* 25% Logística */}
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#374151"
              strokeWidth="3"
              strokeDasharray="25 75"
              strokeDashoffset="-75"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-bold text-base text-gray-900">100%</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>
        <div className="w-full space-y-2">
          {[
            { label: "Componentes", pct: "45%", color: PRIMARY },
            { label: "Equipos", pct: "30%", color: "#F4BEBE" },
            { label: "Logística", pct: "25%", color: "#374151" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 text-gray-600">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: item.color }}
                />
                {item.label}
              </span>
              <span className="font-medium text-gray-700">{item.pct}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const statusStyles: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  Completado: { bg: "#D1FAE5", color: "#065F46", label: "Completado" },
  "En Tránsito": { bg: "#FEF3C7", color: "#92400E", label: "En Tránsito" },
  Retrasado: { bg: "#FEE2E2", color: "#991B1B", label: "Retrasado" },
  Procesando: { bg: "#EDE9FE", color: "#5B21B6", label: "Procesando" },
};

const recentOrders = [
  {
    id: "#PO-8921",
    date: "12 Oct 2023",
    supplier: "TechCorp Industries",
    status: "Completado",
  },
  {
    id: "#PO-8922",
    date: "14 Oct 2023",
    supplier: "Global Logistics SA",
    status: "En Tránsito",
  },
  {
    id: "#PO-8923",
    date: "15 Oct 2023",
    supplier: "Componentes Omega",
    status: "Retrasado",
  },
  {
    id: "#PO-8924",
    date: "16 Oct 2023",
    supplier: "Visco Supplies Ltda.",
    status: "Procesando",
  },
];

const criticalInventory = [
  {
    name: "Microchips Tipo A",
    desc: "Stock restante: 45 unidades (Mín. 100)",
    icon: "🔧",
    bg: "#FEE2E2",
  },
  {
    name: "Sensores Ópticos",
    desc: "Stock restante: 120 unidades (Mín. 150)",
    icon: "🔩",
    bg: "#FEF3C7",
  },
  {
    name: "Cableado Industrial",
    desc: "Stock restante: 12m (Mín. 50m)",
    icon: "⚡",
    bg: "#FEE2E2",
  },
];

const kpis = [
  {
    label: "Pedidos totales",
    value: "1,284",
    delta: "+12%",
    positive: true,
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        stroke={PRIMARY_MED}
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h5l2 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="1.5" />
        <circle cx="18.5" cy="18.5" r="1.5" />
      </svg>
    ),
  },
  {
    label: "Inventario total",
    value: "45,910",
    unit: "unidades",
    delta: "-3%",
    positive: false,
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        stroke={PRIMARY_MED}
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      </svg>
    ),
  },
  {
    label: "Gastos mensuales",
    value: "$284.5k",
    delta: "~0%",
    positive: null,
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        stroke={PRIMARY_MED}
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
  {
    label: "Tasa de cumplimiento",
    value: "98.2%",
    delta: "+2.4%",
    positive: true,
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        stroke={PRIMARY_MED}
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

export default function Dashboard() {
  const [, setHovered] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visión General</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Métricas clave y estado operativo actualizado.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white">
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
          Exportar
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow cursor-default"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: PRIMARY_LIGHT }}
              >
                {kpi.icon}
              </div>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  kpi.positive === true
                    ? "bg-green-50 text-green-600"
                    : kpi.positive === false
                      ? "bg-red-50 text-red-500"
                      : "bg-blue-50 text-blue-500"
                }`}
              >
                {kpi.delta}
              </span>
            </div>
            <div className="text-xs text-gray-400 mb-1">{kpi.label}</div>
            <div className="text-2xl font-bold text-gray-900 leading-tight">
              {kpi.value}
              {kpi.unit && (
                <span className="text-sm font-normal text-gray-400 ml-1">
                  {kpi.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="col-span-2 bg-white rounded-xl p-5 border border-gray-100"
          style={{ minHeight: "260px" }}
        >
          <BarChart />
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <DonutChart />
        </div>
      </div>

      {/* Bottom Row: Recent Orders + Critical Inventory */}
      <div className="grid grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="col-span-2 bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-gray-900">Pedidos Recientes</div>
            <button className="text-sm font-medium" style={{ color: PRIMARY }}>
              Ver todos
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="pb-2 text-left font-medium">ID Pedido</th>
                <th className="pb-2 text-left font-medium">Fecha</th>
                <th className="pb-2 text-left font-medium">Proveedor</th>
                <th className="pb-2 text-left font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => {
                const s = statusStyles[order.status];
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td
                      className="py-3 text-sm font-semibold"
                      style={{ color: PRIMARY }}
                    >
                      {order.id}
                    </td>
                    <td className="py-3 text-sm text-gray-500">{order.date}</td>
                    <td className="py-3 text-sm text-gray-700">
                      {order.supplier}
                    </td>
                    <td className="py-3">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Critical Inventory */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="font-semibold text-gray-900 text-sm">
              Inventario Crítico
            </span>
          </div>
          <div className="space-y-3">
            {criticalInventory.map((item) => (
              <div
                key={item.name}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: item.bg }}
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-base flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 leading-tight">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                    {item.desc}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
