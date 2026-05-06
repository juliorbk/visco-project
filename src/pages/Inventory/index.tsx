import { useState } from 'react';

const PRIMARY = '#7B1A1A';
const PRIMARY_LIGHT = '#FDF0F0';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  unit: string;
  status: 'En stock' | 'Bajo stock' | 'Sin stock';
  warehouse: string;
  reorderPoint: number;
  supplier: string;
  history: { delta: number; date: string; time: string; ref: string }[];
}

const items: InventoryItem[] = [
  {
    id: '#INV-0842',
    name: 'Industrial Lubricant XL',
    category: 'Chemicals',
    sku: 'CHM-LUB-001',
    stock: 1240,
    unit: 'L',
    status: 'En stock',
    warehouse: 'WH-West',
    reorderPoint: 200,
    supplier: 'ChemSupply Co.',
    history: [
      { delta: +50, date: 'Yesterday', time: '14:22', ref: 'PO-8901 receipt' },
      { delta: -20, date: 'Yesterday', time: '09:10', ref: 'WO-9910 fulfillment' },
    ],
  },
  {
    id: '#INV-0843',
    name: 'Steel Piping 4"',
    category: 'Hardware',
    sku: 'HRD-PIP-400',
    stock: 12,
    unit: 'units',
    status: 'Bajo stock',
    warehouse: 'WH-East',
    reorderPoint: 50,
    supplier: 'MetalWorks Inc.',
    history: [
      { delta: -8, date: 'Today', time: '09:41', ref: 'WO-9921 fulfillment' },
      { delta: -4, date: 'Yesterday', time: '15:30', ref: 'WO-9915 fulfillment' },
    ],
  },
  {
    id: '#INV-0844',
    name: 'Safety Helmets',
    category: 'Safety',
    sku: 'SAF-HLM-001',
    stock: 0,
    unit: 'units',
    status: 'Sin stock',
    warehouse: 'WH-South',
    reorderPoint: 30,
    supplier: 'SafetyFirst Co.',
    history: [
      { delta: -15, date: '2 days ago', time: '11:00', ref: 'WO-9900 fulfillment' },
    ],
  },
  {
    id: '#INV-0845',
    name: 'Copper Wire 2.5mm',
    category: 'Electrical',
    sku: 'ELC-WIR-025',
    stock: 850,
    unit: 'm',
    status: 'En stock',
    warehouse: 'WH-West',
    reorderPoint: 100,
    supplier: 'ElectroSupply SA',
    history: [
      { delta: +200, date: '3 days ago', time: '10:15', ref: 'PO-8895 receipt' },
    ],
  },
];

const statusConfig: Record<string, { bg: string; color: string }> = {
  'En stock': { bg: '#D1FAE5', color: '#065F46' },
  'Bajo stock': { bg: PRIMARY, color: '#fff' },
  'Sin stock': { bg: '#374151', color: '#fff' },
};

export default function Inventory() {
  const [selected, setSelected] = useState<InventoryItem>(items[1]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || item.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex gap-4 h-full">
      {/* Main Panel */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Inventory<br/>Management</h1>
            <p className="text-sm text-gray-400 mt-1">Manage and track your materials<br/>across all warehouses.</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Export
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium"
              style={{ background: PRIMARY }}
            >
              <span className="text-base leading-none">+</span>
              Add Item
            </button>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="text"
              placeholder="Search inventory..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 placeholder-gray-400"
            />
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option>Chemicals</option>
            <option>Hardware</option>
            <option>Safety</option>
            <option>Electrical</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex-1">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Item Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">SKU</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Stock</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(item => {
                const s = statusConfig[item.status];
                const isSelected = selected?.id === item.id;
                const isLow = item.status === 'Bajo stock' || item.status === 'Sin stock';
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-5 py-4 text-xs text-gray-400 font-mono">{item.id}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">{item.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{item.category}</td>
                    <td className="px-5 py-4 text-xs text-gray-400 font-mono">{item.sku}</td>
                    <td className="px-5 py-4 text-sm font-semibold" style={{ color: isLow ? PRIMARY : '#374151' }}>
                      {item.stock.toLocaleString()} {item.unit}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="w-72 bg-white rounded-xl border border-gray-100 flex flex-col overflow-hidden flex-shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="font-semibold text-gray-900">Item Details</span>
            <button onClick={() => {}} className="text-gray-400 hover:text-gray-600">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Image placeholder */}
          <div className="mx-5 mt-4 h-32 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
            <svg width="32" height="32" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18M9 21V9"/>
            </svg>
          </div>

          {/* Info */}
          <div className="px-5 py-4 flex-1 overflow-y-auto">
            <div className="text-xs text-gray-400 mb-1">{selected.id} • {selected.sku}</div>
            <div className="font-bold text-gray-900 text-base mb-2">{selected.name}</div>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full inline-block mb-4"
              style={{
                background: statusConfig[selected.status].bg,
                color: statusConfig[selected.status].color,
              }}
            >
              {selected.status}
            </span>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Current Stock</div>
                <div className="text-sm font-bold" style={{ color: selected.status !== 'En stock' ? PRIMARY : '#111827' }}>
                  {selected.stock} {selected.unit}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Reorder Point</div>
                <div className="text-sm font-semibold text-gray-900">{selected.reorderPoint} {selected.unit}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Warehouse</div>
                <div className="text-sm font-semibold text-gray-900">{selected.warehouse}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Supplier</div>
                <div className="text-sm font-semibold" style={{ color: PRIMARY }}>{selected.supplier}</div>
              </div>
            </div>

            <div className="font-semibold text-gray-900 text-sm mb-3">Recent History</div>
            <div className="space-y-2">
              {selected.history.map((h, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 flex-shrink-0"/>
                  <div className="flex-1 bg-gray-50 rounded-lg p-2.5 text-xs">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`font-bold ${h.delta < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {h.delta > 0 ? '+' : ''}{h.delta} {selected.unit}
                      </span>
                      <span className="text-gray-400">{h.date}, {h.time}</span>
                    </div>
                    <div className="text-gray-500">{h.ref}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 py-4 border-t border-gray-100 space-y-2">
            <button className="w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Edit Item
            </button>
            <button className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ background: PRIMARY }}>
              Create PO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}