import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../../api/procurement";
import { getProducts } from "../../api/products";
import type { PurchaseOrderResponse, ProductResponse } from "../../index";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLE } from "../../utils/labels";

const PRIMARY = "#7B1A1A";

export default function DashboardPage() {
  const [orders, setOrders] = useState<PurchaseOrderResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getOrders().catch(() => [] as PurchaseOrderResponse[]),
      getProducts({ page: 0, size: 100 }).then((r) => r.content ?? (r as any)).catch(() => [] as ProductResponse[]),
    ]).then(([ords, prods]) => {
      setOrders(ords);
      setProducts(prods);
      setLoading(false);
    });
  }, []);

  const pending = orders.filter((o) => o.status === "PENDING").length;
  const approved = orders.filter((o) => o.status === "APPROVED").length;
  const activeProducts = products.filter((p) => p.active).length;
  const recentOrders = orders.slice(0, 5);

  const kpis = [
    { label: "Total Orders", value: orders.length, icon: "🛒", delta: "", color: "#7B1A1A" },
    { label: "Pending Approval", value: pending, icon: "⏳", color: "#F59E0B" },
    { label: "Approved / In Progress", value: approved, icon: "✅", color: "#10B981" },
    { label: "Active Products", value: activeProducts, icon: "📦", color: "#6366F1" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Resumen operativo actualizado.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className="text-xs text-gray-400 mb-1">{k.label}</div>
            <div className="text-3xl font-bold" style={{ color: k.color }}>
              {loading ? <span className="text-gray-200 animate-pulse">—</span> : k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="font-semibold text-gray-900">Órdenes Recientes</span>
          <Link to="/procurement/orders" className="text-sm font-semibold" style={{ color: PRIMARY }}>
            Ver todas →
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {["N° Orden", "Proveedor", "Fecha", "Estado"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-300 text-sm">Cargando…</td></tr>
            ) : recentOrders.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-sm">No hay órdenes todavía.</td></tr>
            ) : (
              recentOrders.map((o) => {
                const s = ORDER_STATUS_STYLE[o.status];
                return (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 text-sm font-bold" style={{ color: PRIMARY }}>{o.orderNumber}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{o.supplierName}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString("es-VE", { day: "2-digit", month: "short" })}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                        {ORDER_STATUS_LABELS[o.status]}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/products" className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "#FDF0F0" }}>📦</div>
          <div>
            <div className="font-semibold text-gray-900 group-hover:underline">Gestionar Productos</div>
            <div className="text-sm text-gray-400">{activeProducts} productos activos</div>
          </div>
        </Link>
        <Link to="/procurement/orders" className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "#FDF0F0" }}>🛒</div>
          <div>
            <div className="font-semibold text-gray-900 group-hover:underline">Órdenes de Compra</div>
            <div className="text-sm text-gray-400">{pending} pendientes de aprobación</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
