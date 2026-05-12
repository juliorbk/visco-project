import { useState, useEffect, useCallback } from "react";
import Modal from "./components/Modal";
import { getGoodsReceipts, getOrder } from "./api/procurement";
import type { ReceiveGoodsResponse, PurchaseOrderResponse } from "./index";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLE } from "./utils/labels";

const PRIMARY = "#7B1A1A";

export default function InboundPage() {
  const [receipts, setReceipts] = useState<ReceiveGoodsResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [detailReceipt, setDetailReceipt] = useState<ReceiveGoodsResponse | null>(null);
  const [linkedOrder, setLinkedOrder] = useState<PurchaseOrderResponse | null>(null);
  const [linking, setLinking] = useState(false);

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGoodsReceipts();
      setReceipts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReceipts(); }, [fetchReceipts]);

  const openDetail = async (r: ReceiveGoodsResponse) => {
    setDetailReceipt(r);
    setLinkedOrder(null);
    setLinking(true);
    try {
      const order = await getOrder(r.purchaseOrderId);
      setLinkedOrder(order);
    } catch {
      setLinkedOrder(null);
    } finally {
      setLinking(false);
    }
  };

  const filtered = search
    ? receipts.filter(
        (r) =>
          r.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
          r.orderNumber.toLowerCase().includes(search.toLowerCase())
      )
    : receipts;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-VE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recepciones / Entradas</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Historial de recepción de mercancía vinculada a órdenes de compra.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por n° de recepción u orden…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {["N° Recepción", "N° Orden", "Fecha", "Estado", "Ítems", "Notas", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                    Cargando recepciones…
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-sm text-gray-400"
                >
                  No hay recepciones registradas.
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const s = ORDER_STATUS_STYLE[r.updatedStatus];
                return (
                  <tr
                    key={r.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm font-bold" style={{ color: PRIMARY }}>
                      {r.receiptNumber}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 font-mono">
                      {r.orderNumber}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(r.receivedAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full"
                        style={{ background: s.bg, color: s.color }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: s.dot }}
                        />
                        {ORDER_STATUS_LABELS[r.updatedStatus]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">
                      {r.items.length} ítem(s)
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400 max-w-[160px] truncate">
                      {r.notes || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => openDetail(r)}
                        className="text-xs font-semibold hover:underline"
                        style={{ color: PRIMARY }}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      <Modal
        open={!!detailReceipt}
        onClose={() => { setDetailReceipt(null); setLinkedOrder(null); }}
        title={`Recepción — ${detailReceipt?.receiptNumber}`}
        size="xl"
      >
        {detailReceipt && (
          <div className="space-y-5">
            {/* Info grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "N° de Recepción", value: detailReceipt.receiptNumber },
                { label: "Orden de Compra", value: detailReceipt.orderNumber },
                {
                  label: "Fecha de recepción",
                  value: formatDate(detailReceipt.receivedAt),
                },
                {
                  label: "Estado actual de la OC",
                  value: ORDER_STATUS_LABELS[detailReceipt.updatedStatus],
                },
                ...(detailReceipt.notes
                  ? [{ label: "Notas", value: detailReceipt.notes }]
                  : []),
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    {label}
                  </div>
                  <div className="text-sm font-semibold text-gray-800 mt-1">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Items */}
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Ítems Recibidos
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-2 text-left text-xs text-gray-400 font-semibold">
                      Producto
                    </th>
                    <th className="pb-2 text-center text-xs text-gray-400 font-semibold">
                      SKU
                    </th>
                    <th className="pb-2 text-center text-xs text-gray-400 font-semibold">
                      Esperado
                    </th>
                    <th className="pb-2 text-center text-xs text-gray-400 font-semibold">
                      Recibido
                    </th>
                    <th className="pb-2 text-right text-xs text-gray-400 font-semibold">
                      Diferencia
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {detailReceipt.items.map((item) => (
                    <tr key={item.productId}>
                      <td className="py-2 text-gray-800 font-medium">
                        {item.productName}
                      </td>
                      <td className="py-2 text-center text-gray-400 font-mono text-xs">
                        {item.productSku}
                      </td>
                      <td className="py-2 text-center text-gray-700">
                        {item.expectedQuantity}
                      </td>
                      <td className="py-2 text-center text-gray-700">
                        {item.receivedQuantity}
                      </td>
                      <td
                        className={`py-2 text-right font-semibold ${
                          item.difference === 0
                            ? "text-gray-400"
                            : item.difference > 0
                            ? "text-blue-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.difference > 0
                          ? `+${item.difference}`
                          : item.difference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Linked PO info */}
            {linking ? (
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                Cargando orden vinculada…
              </div>
            ) : linkedOrder ? (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-blue-500 uppercase tracking-wide font-semibold">
                    Orden Vinculada
                  </span>
                  <div className="font-bold text-blue-800 mt-0.5">
                    {linkedOrder.orderNumber} — {linkedOrder.supplierName}
                  </div>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full"
                  style={{
                    background: ORDER_STATUS_STYLE[linkedOrder.status].bg,
                    color: ORDER_STATUS_STYLE[linkedOrder.status].color,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: ORDER_STATUS_STYLE[linkedOrder.status].dot,
                    }}
                  />
                  {ORDER_STATUS_LABELS[linkedOrder.status]}
                </span>
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                No se pudo cargar la orden vinculada.
              </div>
            )}

            {/* Close */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setDetailReceipt(null); setLinkedOrder(null); }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}