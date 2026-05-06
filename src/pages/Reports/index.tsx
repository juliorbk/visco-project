import { useState } from "react";

const PRIMARY = "#7B1A1A";
const PRIMARY_LIGHT = "#FDF0F0";

const timeRanges = [
  "Last 7 Days",
  "This Month",
  "This Quarter",
  "Year to Date",
];

const reportLibrary = [
  {
    label: "Expenses",
    desc: "Cost analysis and budget tracking.",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke={PRIMARY}
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    active: true,
  },
  {
    label: "Inventory",
    desc: "Stock levels and turnover rates.",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="#6B7280"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    active: false,
  },
  {
    label: "Performance",
    desc: "Supplier and procurement KPIs.",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="#6B7280"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    active: false,
  },
];

// Area chart data
function AreaChart() {
  const points = [
    { x: 0, current: 20, prev: 35 },
    { x: 1, current: 35, prev: 40 },
    { x: 2, current: 28, prev: 45 },
    { x: 3, current: 45, prev: 50 },
    { x: 4, current: 55, prev: 55 },
    { x: 5, current: 70, prev: 60 },
    { x: 6, current: 65, prev: 65 },
    { x: 7, current: 80, prev: 70 },
    { x: 8, current: 90, prev: 75 },
    { x: 9, current: 85, prev: 80 },
    { x: 10, current: 100, prev: 85 },
  ];
  const w = 600;
  const h = 120;
  const maxVal = 120;

  const toPath = (vals: { x: number; val: number }[]) => {
    return vals
      .map((p, i) => {
        const x = (p.x / (points.length - 1)) * w;
        const y = h - (p.val / maxVal) * h;
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  };

  const currentPath = toPath(points.map((p) => ({ x: p.x, val: p.current })));
  const prevPath = toPath(points.map((p) => ({ x: p.x, val: p.prev })));

  const toArea = (path: string) => `${path} L${w},${h} L0,${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full"
      style={{ height: "120px" }}
    >
      <defs>
        <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PRIMARY} stopOpacity="0.25" />
          <stop offset="100%" stopColor={PRIMARY} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4BEBE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F4BEBE" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Previous area */}
      <path d={toArea(prevPath)} fill="url(#prevGrad)" />
      <path d={prevPath} fill="none" stroke="#F4BEBE" strokeWidth="2" />
      {/* Current area */}
      <path d={toArea(currentPath)} fill="url(#currentGrad)" />
      <path d={currentPath} fill="none" stroke={PRIMARY} strokeWidth="2.5" />
    </svg>
  );
}

// Bar chart for expenses by category
function CategoryChart() {
  const cats = [
    { label: "IT", current: 80, prev: 40 },
    { label: "Mktg", current: 60, prev: 30 },
    { label: "Ops", current: 50, prev: 35 },
    { label: "HR", current: 35, prev: 20 },
    { label: "Fac", current: 25, prev: 15 },
  ];
  const max = 100;

  return (
    <div className="flex items-end gap-3" style={{ height: "80px" }}>
      {cats.map((c) => (
        <div key={c.label} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full flex gap-0.5 items-end"
            style={{ height: "64px" }}
          >
            <div
              className="flex-1 rounded-sm opacity-50"
              style={{
                height: `${(c.prev / max) * 64}px`,
                background: "#F4BEBE",
              }}
            />
            <div
              className="flex-1 rounded-sm"
              style={{
                height: `${(c.current / max) * 64}px`,
                background: PRIMARY,
              }}
            />
          </div>
          <span className="text-xs text-gray-400">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Reports() {
  const [selectedRange, setSelectedRange] = useState("This Month");
  const [selectedReport, setSelectedReport] = useState("Expenses");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Comprehensive insights across your enterprise operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium"
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white">
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Left Sidebar */}
        <div className="space-y-4">
          {/* Time Range */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="font-semibold text-gray-900 mb-4">Time Range</div>
            <div className="space-y-3">
              {timeRanges.map((range) => (
                <label
                  key={range}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      borderColor:
                        selectedRange === range ? PRIMARY : "#D1D5DB",
                      background:
                        selectedRange === range ? PRIMARY : "transparent",
                    }}
                    onClick={() => setSelectedRange(range)}
                  >
                    {selectedRange === range && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span
                    className="text-sm transition-colors"
                    style={{
                      color: selectedRange === range ? PRIMARY : "#374151",
                      fontWeight: selectedRange === range ? 600 : 400,
                    }}
                    onClick={() => setSelectedRange(range)}
                  >
                    {range}
                  </span>
                </label>
              ))}
            </div>
            <button
              className="flex items-center gap-2 mt-4 text-sm"
              style={{ color: PRIMARY }}
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Custom Range
            </button>
          </div>

          {/* Report Library */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="font-semibold text-gray-900 mb-4">
              Report Library
            </div>
            <div className="space-y-3">
              {reportLibrary.map((report) => (
                <div
                  key={report.label}
                  onClick={() => setSelectedReport(report.label)}
                  className="p-3 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background:
                      selectedReport === report.label
                        ? PRIMARY_LIGHT
                        : "transparent",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {report.icon}
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color:
                          selectedReport === report.label ? PRIMARY : "#374151",
                      }}
                    >
                      {report.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-tight">
                    {report.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Report */}
          <div
            className="rounded-xl p-5 text-white"
            style={{ background: "#1a1a2e" }}
          >
            <div className="font-semibold mb-1">Custom Report</div>
            <p className="text-xs opacity-60 mb-4 leading-relaxed">
              Build a specialized report with custom metrics.
            </p>
            <button className="w-full py-2.5 bg-white rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
              Launch Builder
            </button>
          </div>
        </div>

        {/* Main Charts Area */}
        <div className="col-span-3 space-y-4">
          {/* Total Expenditures */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-semibold text-gray-900">
                  Total Expenditures
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Trailing 30 days vs previous period
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: PRIMARY }}
                  />
                  Current
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  Previous
                </span>
              </div>
            </div>
            <AreaChart />
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Expenses by Category */}
            <div className="col-span-1 bg-white rounded-xl border border-gray-100 p-5">
              <div className="font-semibold text-gray-900 mb-1">
                Expenses by Category
              </div>
              <div className="text-xs text-gray-400 mb-4">
                Top 5 procurement areas
              </div>
              <CategoryChart />
            </div>

            {/* KPI tiles */}
            <div className="col-span-2 grid grid-cols-2 gap-4">
              {/* Total Spend */}
              <div
                className="rounded-xl p-5 text-white"
                style={{ background: PRIMARY }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="2" y1="20" x2="22" y2="20" />
                  </svg>
                  <span className="text-sm opacity-80">Total Spend</span>
                </div>
                <div className="text-3xl font-bold mb-1">$2.4M</div>
                <div className="text-xs opacity-60 flex items-center gap-1">
                  <span style={{ color: "#86EFAC" }}>↑ 12% vs last mo</span>
                </div>
              </div>

              {/* Invoices Processed */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="#6B7280"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-500">Invoices Proc.</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">842</div>
                <div className="text-xs text-green-500 flex items-center gap-1">
                  ↓ 3% vs last mo
                </div>
              </div>

              {/* Efficiency Score - full width */}
              <div
                className="col-span-2 rounded-xl p-5 text-white relative overflow-hidden"
                style={{ background: "#0d1117" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm opacity-60 mb-2">
                      Efficiency Score
                    </div>
                    <div className="text-3xl font-bold">
                      94{" "}
                      <span className="text-lg font-normal opacity-50">
                        / 100
                      </span>
                    </div>
                  </div>
                  {/* Gauge */}
                  <div className="relative w-16 h-16">
                    <svg
                      viewBox="0 0 36 36"
                      className="w-full h-full -rotate-90"
                    >
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="#1f2937"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke={PRIMARY}
                        strokeWidth="3"
                        strokeDasharray="94 6"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">94</span>
                    </div>
                  </div>
                </div>
                {/* Decorative wave */}
                <div className="absolute right-0 bottom-0 opacity-10">
                  <svg width="120" height="60" viewBox="0 0 120 60">
                    <path
                      d="M0 30 Q15 10 30 30 Q45 50 60 30 Q75 10 90 30 Q105 50 120 30"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M0 40 Q15 20 30 40 Q45 60 60 40 Q75 20 90 40 Q105 60 120 40"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
