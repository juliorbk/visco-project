import { useState } from "react";
import Modal from "./Modal";
import type { PurchaseOrderResponse, ReceiveGoodsRequest } from "../index";

const PRIMARY = "#7B1A1A";

interface ReceiveGoodsModalProps {
  open: boolean;
  order: PurchaseOrderResponse | null;
  onClose: () => void;
  onConfirm: (orderId: number, data: ReceiveGoodsRequest) => Promise<void>;
  loading?: boolean;
}

export default function ReceiveGoodsModal({
  open,
  order,
  onClose,
  onConfirm,
  loading,
}: ReceiveGoodsModalProps) {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState("");

  const getQty = (productId: number, expected: number) =>
    quantities[productId] ?? expected;

  const handleChange = (productId: number, value: string) => {
    setQuantities((q) => ({ ...q, [productId]: Math.max(0, Number(value)) }));
  };

  const handleConfirm = async () => {
    if (!order) return;
    const items = order.items.map((item) => ({
      productId: item.productId,
      receivedQuantity: getQty(item.productId, item.quantity),
    }));
    await onConfirm(order.id, { items, notes: notes || undefined });
    setQuantities({});
    setNotes("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Recibir Mercancía" size="lg">
      {!order ? null : (
        <div className="space-y-5">
          {/* Order info */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl text-sm">
            <div>
              <span className="text-gray-400 text-xs">Orden</span>
              <div className="font-bold" style={{ color: PRIMARY }}>{order.orderNumber}</div>
            </div>
            <div>
              <span className="text-gray-400 text-xs">Proveedor</span>
              <div className="font-semibold text-gray-800">{order.supplierName}</div>
            </div>
          </div>

          {/* Items table */}
          <div>
            <div className="grid gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2" style={{ gridTemplateColumns: "1fr 100px 100px 90px" }}>
              <span>Producto</span>
              <span className="text-center">Esperado</span>
              <span className="text-center">Recibido</span>
              <span className="text-center">Diferencia</span>
            </div>

            <div className="space-y-2">
              {order.items.map((item) => {
                const received = getQty(item.productId, item.quantity);
                const diff = received - item.quantity;
                return (
                  <div
                    key={item.productId}
                    className="grid gap-2 items-center py-2 border-b border-gray-50 last:border-0"
                    style={{ gridTemplateColumns: "1fr 100px 100px 90px" }}
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                      <div className="text-xs text-gray-400 font-mono">{item.productSku}</div>
                    </div>
                    <div className="text-center text-sm font-semibold text-gray-700">{item.quantity}</div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        value={received}
                        onChange={(e) => handleChange(item.productId, e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300"
                      />
                    </div>
                    <div className={`text-center text-sm font-bold ${diff === 0 ? "text-gray-400" : diff > 0 ? "text-blue-500" : "text-red-500"}`}>
                      {diff > 0 ? `+${diff}` : diff}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diff summary */}
          {order.items.some((item) => getQty(item.productId, item.quantity) !== item.quantity) && (
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
              ⚠️ Hay diferencias entre las cantidades esperadas y recibidas. La orden quedará como <strong>Parcialmente Entregada</strong> si no cuadran todos los ítems.
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notas (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 resize-none"
              placeholder="Observaciones sobre la recepción…"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: loading ? "#9CA3AF" : PRIMARY }}
            >
              {loading ? "Confirmando…" : "Confirmar Recepción"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
