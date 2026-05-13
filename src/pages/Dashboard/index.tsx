import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getOrders } from "../../api/procurement";
import { getProducts } from "../../api/products";
import type { PurchaseOrderResponse, ProductResponse } from "../../index";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLE } from "../../utils/labels";
import { ShoppingCartIcon, ClockIcon, CheckCircleIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import ChartCard from "./ChartCard";
import ExpensesBarChart from "./ExpensesBarChart";
import ExpenseBreakdownDonut from "./ExpenseBreakdownDonut";
import { MOCK_METRICS } from "./metricsData";

const PRIMARY = "#7B1A1A";

const ORDER_ROLES = ["ADMIN", "MANAGER", "PROCUREMENT"] as const;

export default function DashboardPage() {
  const { hasRole } = useAuth();
  const canViewOrders = hasRole(...ORDER_ROLES);
  const [orders, setOrders] = useState<PurchaseOrderResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const promises: Promise<any>[] = [];
    if (canViewOrders) {
      promises.push(getOrders().catch(() => [] as PurchaseOrderResponse[]));
    } else {
      promises.push(Promise.resolve([] as PurchaseOrderResponse[]));
    }
    promises.push(
      getProducts({ page: 0, size: 100 }).then((r) => r.content ?? (r as any)).catch(() => [] as ProductResponse[])
    );
    Promise.all(promises).then(([ords, prods]) => {
      setOrders(ords as PurchaseOrderResponse[]);
      setProducts(prods as ProductResponse[]);
      setLoading(false);
    });
  }, [canViewOrders]);

  const pending = orders.filter((o) => o.status === "PENDING").length;
  const inTransit = orders.filter((o) => o.status === "IN_TRANSIT").length;
  const activeProducts = products.filter((p) => p.active).length;
  const recentOrders = orders.slice(0, 5);

  const kpis = [
    { label: "Órdenes Totales", value: orders.length, icon: ShoppingCartIcon, color: "#7B1A1A" },
    { label: "Pendientes", value: pending, icon: ClockIcon, color: "#F59E0B" },
    { label: "En Tránsito", value: inTransit, icon: CheckCircleIcon, color: "#10B981" },
    { label: "Productos Activos", value: activeProducts, icon: ArchiveBoxIcon, color: "#6366F1" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Resumen operativo actualizado.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-2"><k.icon className="w-6 h-6" style={{ color: k.color }} /></div>
            <div className="text-xs text-gray-400 mb-1">{k.label}</div>
            <div className="text-3xl font-bold" style={{ color: k.color }}>
              {loading ? <span className="text-gray-200 animate-pulse">—</span> : k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <ChartCard title="Gastos vs Proyecciones" subtitle="Últimos 6 meses">
            <ExpensesBarChart data={MOCK_METRICS.monthlyExpenses} />
          </ChartCard>
        </div>
        <div className="lg:col-span-4">
          <ChartCard title="Desglose de Gastos" subtitle="Distribución por categoría">
            <ExpenseBreakdownDonut data={MOCK_METRICS.expenseBreakdown} />
          </ChartCard>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="font-semibold text-gray-900">Órdenes Recientes</span>
          <Link to="/procurement/orders" className="text-sm font-semibold hover:underline" style={{ color: PRIMARY }}>
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
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#FDF0F0" }}><ArchiveBoxIcon className="w-6 h-6" style={{ color: PRIMARY }} /></div>
          <div>
            <div className="font-semibold text-gray-900 group-hover:underline">Gestionar Productos</div>
            <div className="text-sm text-gray-400">{activeProducts} productos activos</div>
          </div>
        </Link>
        <Link to="/procurement/orders" className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#FDF0F0" }}><ShoppingCartIcon className="w-6 h-6" style={{ color: PRIMARY }} /></div>
          <div>
            <div className="font-semibold text-gray-900 group-hover:underline">Órdenes de Compra</div>
            <div className="text-sm text-gray-400">{pending} pendientes de aprobación</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
