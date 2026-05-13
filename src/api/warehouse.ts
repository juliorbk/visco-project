import client from "./client";
import type {
  ReceiveGoodsRequest,
  ReceiveGoodsResponse,
  WarehouseResponse,
  ProductStockBreakdown,
  WarehouseStockSummary,
} from "../index";

export async function receiveGoods(
  id: number,
  data: ReceiveGoodsRequest
): Promise<ReceiveGoodsResponse> {
  const res = await client.post<ReceiveGoodsResponse>(
    `/warehouse/orders/${id}/receive`,
    data
  );
  return res.data;
}

export async function getGoodsReceipts(): Promise<ReceiveGoodsResponse[]> {
  const res = await client.get<ReceiveGoodsResponse[]>(
    "/warehouse/receipts"
  );
  return res.data;
}

export async function getGoodsReceipt(
  id: number
): Promise<ReceiveGoodsResponse> {
  const res = await client.get<ReceiveGoodsResponse>(
    `/warehouse/receipts/${id}`
  );
  return res.data;
}

export async function getReceiptsByOrderId(
  orderId: number
): Promise<ReceiveGoodsResponse[]> {
  const res = await client.get<ReceiveGoodsResponse[]>(
    `/warehouse/orders/${orderId}/receipts`
  );
  return res.data;
}

export async function getWarehouses(): Promise<WarehouseResponse[]> {
  const res = await client.get<WarehouseResponse[]>("/warehouse");
  return res.data;
}

export async function getProductStockBreakdown(
  productId: number
): Promise<ProductStockBreakdown> {
  const res = await client.get<ProductStockBreakdown>(
    `/warehouse/products/${productId}/stock-breakdown`
  );
  return res.data;
}

export async function getGlobalStockSummary(): Promise<WarehouseStockSummary[]> {
  const res = await client.get<WarehouseStockSummary[]>("/warehouse/stock-summary");
  return res.data;
}
