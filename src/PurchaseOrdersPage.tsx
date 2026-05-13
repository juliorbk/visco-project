import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "./components/Modal";
import PurchaseOrderForm from "./components/PurchaseOrderForm";
import ReceiveGoodsModal from "./components/ReceiveGoodsModal";
import {
  getOrders,
  getOrder,
  createOrder,
  approveOrder,
  cancelOrder,
} from "./api/procurement";
import { receiveGoods } from "./api/warehouse";
import client from "./api/client";
import { useAuth } from "./contexts/AuthContext";
import type {
  PurchaseOrderResponse,
  PurchaseOrderRequest,
  PurchaseOrderStatus,
  SupplierOption,
  ProductResponse,
  ReceiveGoodsRequest,
} from "./index";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLE,
  STATUS_FLOW,
} from "./utils/labels";
import { generatePurchaseOrderPdf } from "./utils/pdf";
import { getSuppliers } from "./api/suppliers";
import { CheckIcon } from "@heroicons/react/24/outline";

const PRIMARY = "#7B1A1A";

const ALL_STATUSES: PurchaseOrderStatus[] = [
  "PENDING", "IN_TRANSIT", "DELIVERED",
  "PARTIALLY_DELIVERED", "CANCELLED",
];

export default function PurchaseOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasRole, user } = useAuth();
  const canCreate = hasRole("ADMIN", "MANAGER", "PROCUREMENT");
  const canApprove = hasRole("ADMIN", "MANAGER");
  const canCancel = hasRole("ADMIN", "MANAGER");
  const canReceive = hasRole("ADMIN", "PROCUREMENT", "WAREHOUSEMAN");
  const [orders, setOrders] = useState<PurchaseOrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatus | "ALL">("ALL");

  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);

  const [createModal, setCreateModal] = useState(false);
  const [detailOrder, setDetailOrder] = useState<PurchaseOrderResponse | null>(null);
  const [receiveOrder, setReceiveOrder] = useState<PurchaseOrderResponse | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId) {
      setSearchParams({}, { replace: true });
      getOrder(Number(orderId)).then(setDetailOrder).catch(() => {});
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    getSuppliers().then((data) => setSuppliers(data.filter((s) => s.active))).catch(() =>
      setSuppliers([{ id: 1, name: "Proveedor Demo", active: true }])
    );
    client.get("/inventory/products", { params: { page: 0, size: 100 } })
      .then((r) => {
        const all: ProductResponse[] = r.data.content ?? r.data;
        setProducts(all.filter((p) => p.active));
      })
      .catch(() => setProducts([]));
  }, []);

  const handleCreate = useCallback(async (data: Omit<PurchaseOrderRequest, "createdById">) => {
    setSaving(true);
    try {
      await createOrder({ ...data, createdById: user!.id });
      setCreateModal(false);
      fetchOrders();
    } finally {
      setSaving(false);
    }
  }, [fetchOrders, user]);

  const handleApprove = useCallback(async (id: number) => {
    setSaving(true);
    try {
      await approveOrder(id);
      fetchOrders();
      if (detailOrder?.id === id) {
        setDetailOrder(null);
      }
    } finally {
      setSaving(false);
    }
  }, [fetchOrders, detailOrder]);

  const handleCancel = useCallback(async (id: number) => {
    setSaving(true);
    try {
      await cancelOrder(id);
      fetchOrders();
      if (detailOrder?.id === id) setDetailOrder(null);
    } finally {
      setSaving(false);
    }
  }, [fetchOrders, detailOrder]);

  const handleReceive = useCallback(async (orderId: number, data: ReceiveGoodsRequest) => {
    setSaving(true);
    try {
      await receiveGoods(orderId, data);
      setReceiveOrder(null);
      fetchOrders();
    } finally {
      setSaving(false);
    }
  }, [fetchOrders]);

  const handleDownloadPdf = async (orderId: number) => {
    setDownloadingPdf(true);
    try {
      const fresh = await getOrder(orderId);
      generatePurchaseOrderPdf(fresh);
    } catch {
      alert("Error al obtener los datos de la orden. Intenta de nuevo.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const filtered =
    statusFilter === "ALL"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Órdenes de Compra</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestiona, aprueba y rastrea las órdenes de compra.</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
            style={{ background: PRIMARY }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Nueva Orden
          </button>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${statusFilter === "ALL" ? "text-white" : "text-gray-500 bg-white border border-gray-200 hover:bg-gray-50"}`}
          style={statusFilter === "ALL" ? { background: PRIMARY } : {}}
        >
          Todas ({orders.length})
        </button>
        {ALL_STATUSES.map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          const style = ORDER_STATUS_STYLE[s];
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
              style={
                statusFilter === s
                  ? { background: style.dot, color: "#fff" }
                  : { background: style.bg, color: style.color }
              }
            >
              {ORDER_STATUS_LABELS[s]} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {["N° Orden", "Proveedor", "Descripción", "Fecha", "Creado por", "Estado", "Ítems", "Acciones"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                    Cargando órdenes…
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">
                  No hay órdenes con el filtro seleccionado.
                </td>
              </tr>
            ) : (
              filtered.map((order) => {
                const s = ORDER_STATUS_STYLE[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-bold" style={{ color: PRIMARY }}>{order.orderNumber}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{order.supplierName}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 max-w-xs truncate">{order.description}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{order.createdBy}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{order.items.length} ítem(s)</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDetailOrder(order)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: PRIMARY }}
                          title="Ver detalle"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        {order.status === "PENDING" && canApprove && (
                          <button
                            onClick={() => handleApprove(order.id)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-blue-600"
                            title="Aprobar"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </button>
                        )}
                        {order.status === "IN_TRANSIT" && canReceive && (
                          <button
                            onClick={() => setReceiveOrder(order)}
                            className="p-1.5 rounded-lg hover:bg-green-50 transition-colors text-green-600"
                            title="Recibir mercancía"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><polyline points="12 11 12 17"/><line x1="9" y1="14" x2="12" y2="17"/><line x1="15" y1="14" x2="12" y2="17"/>
                            </svg>
                          </button>
                        )}
                        {order.status === "PENDING" && canCancel && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-500"
                            title="Cancelar"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create order modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Nueva Orden de Compra" size="xl">
        <PurchaseOrderForm
          suppliers={suppliers}
          products={products}
          onSubmit={handleCreate}
          onCancel={() => setCreateModal(false)}
          loading={saving}
        />
      </Modal>

      {/* Detail modal with status timeline */}
      <Modal open={!!detailOrder} onClose={() => setDetailOrder(null)} title={`Detalle — ${detailOrder?.orderNumber}`} size="xl">
        {detailOrder && (
          <div className="space-y-5">
            {/* Status timeline */}
            <div className="flex items-center gap-0">
              {STATUS_FLOW.map((step, i) => {
                const activeIdx = STATUS_FLOW.indexOf(detailOrder.status as any);
                const done = i < activeIdx;
                const current = i === activeIdx;
                const s = ORDER_STATUS_STYLE[step];
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                        style={{
                          background: done || current ? s.dot : "#E5E7EB",
                          color: done || current ? "#fff" : "#9CA3AF",
                        }}
                      >
                        {done ? <CheckIcon className="w-4 h-4" /> : i + 1}
                      </div>
                      <div className="text-xs mt-1 whitespace-nowrap" style={{ color: current ? s.color : "#9CA3AF", fontWeight: current ? 600 : 400 }}>
                        {ORDER_STATUS_LABELS[step]}
                      </div>
                    </div>
                    {i < STATUS_FLOW.length - 1 && (
                      <div className="flex-1 h-0.5 mx-1 mb-4 rounded" style={{ background: done ? s.dot : "#E5E7EB" }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Proveedor", value: detailOrder.supplierName },
                { label: "Creado por", value: detailOrder.createdBy },
                { label: "Fecha de creación", value: formatDate(detailOrder.createdAt) },
                { label: "Estado actual", value: ORDER_STATUS_LABELS[detailOrder.status] },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
                  <div className="text-sm font-semibold text-gray-800 mt-1">{value}</div>
                </div>
              ))}
            </div>

            {/* Items */}
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Ítems de la Orden</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-2 text-left text-xs text-gray-400 font-semibold">Producto</th>
                    <th className="pb-2 text-center text-xs text-gray-400 font-semibold">SKU</th>
                    <th className="pb-2 text-center text-xs text-gray-400 font-semibold">Cant.</th>
                    <th className="pb-2 text-right text-xs text-gray-400 font-semibold">Precio Unit.</th>
                    <th className="pb-2 text-right text-xs text-gray-400 font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {detailOrder.items.map((item) => (
                    <tr key={item.productId}>
                      <td className="py-2 text-gray-800 font-medium">{item.productName}</td>
                      <td className="py-2 text-center text-gray-400 font-mono text-xs">{item.productSku}</td>
                      <td className="py-2 text-center text-gray-700">{item.quantity}</td>
                      <td className="py-2 text-right text-gray-700">${item.unitPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 text-right font-semibold" style={{ color: PRIMARY }}>${item.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-100">
                    <td colSpan={4} className="pt-2 text-right text-sm font-semibold text-gray-600">Total</td>
                    <td className="pt-2 text-right text-lg font-bold" style={{ color: PRIMARY }}>
                      ${detailOrder.items.reduce((a, i) => a + i.subtotal, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Actions in modal */}
            <div className="flex gap-2 pt-1">
              {detailOrder.status === "PENDING" && canApprove && (
                <button
                  onClick={() => { handleApprove(detailOrder.id); setDetailOrder(null); }}
                  className="p-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
                  style={{ background: "#3B82F6" }}
                  title="Aprobar orden"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
              )}
              {detailOrder.status === "IN_TRANSIT" && canReceive && (
                <button
                  onClick={() => { setReceiveOrder(detailOrder); setDetailOrder(null); }}
                  className="p-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
                  style={{ background: "#10B981" }}
                  title="Recibir mercancía"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><polyline points="12 11 12 17"/><line x1="9" y1="14" x2="12" y2="17"/><line x1="15" y1="14" x2="12" y2="17"/>
                  </svg>
                </button>
              )}
              {detailOrder.status === "PENDING" && canCancel && (
                <button
                  onClick={() => { handleCancel(detailOrder.id); setDetailOrder(null); }}
                  className="p-2.5 rounded-xl text-white transition-opacity hover:opacity-90 bg-red-600"
                  title="Cancelar orden"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                </button>
              )}
              <button
                onClick={() => handleDownloadPdf(detailOrder.id)}
                disabled={downloadingPdf}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                title="Descargar PDF"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
              <button
                onClick={() => setDetailOrder(null)}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                title="Cerrar"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Receive goods modal */}
      <ReceiveGoodsModal
        open={!!receiveOrder}
        order={receiveOrder}
        onClose={() => setReceiveOrder(null)}
        onConfirm={handleReceive}
        loading={saving}
      />
    </div>
  );
}
