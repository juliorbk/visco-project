import client from "./client";
import type {
  PurchaseOrderRequest,
  PurchaseOrderResponse,
  ReceiveGoodsRequest,
  ReceiveGoodsResponse,
} from "../index";

export async function getOrders(): Promise<PurchaseOrderResponse[]> {
  const res = await client.get<PurchaseOrderResponse[]>(
    "/procurement/orders"
  );
  return res.data;
}

export async function getOrder(id: number): Promise<PurchaseOrderResponse> {
  const res = await client.get<PurchaseOrderResponse>(
    `/procurement/orders/${id}`
  );
  return res.data;
}

export async function createOrder(
  data: PurchaseOrderRequest
): Promise<PurchaseOrderResponse> {
  const res = await client.post<PurchaseOrderResponse>(
    "/procurement/orders",
    data
  );
  return res.data;
}

export async function approveOrder(
  id: number
): Promise<PurchaseOrderResponse> {
  const res = await client.patch<PurchaseOrderResponse>(
    `/procurement/orders/${id}/approve`
  );
  return res.data;
}

export async function cancelOrder(id: number): Promise<PurchaseOrderResponse> {
  const res = await client.patch<PurchaseOrderResponse>(
    `/procurement/orders/${id}/cancel`
  );
  return res.data;
}

export async function receiveGoods(
  id: number,
  data: ReceiveGoodsRequest
): Promise<ReceiveGoodsResponse> {
  const res = await client.post<ReceiveGoodsResponse>(
    `/procurement/orders/${id}/receive`,
    data
  );
  return res.data;
}

export async function getGoodsReceipts(): Promise<ReceiveGoodsResponse[]> {
  const res = await client.get<ReceiveGoodsResponse[]>(
    "/procurement/receive-goods"
  );
  return res.data;
}

export async function getGoodsReceipt(
  id: number
): Promise<ReceiveGoodsResponse> {
  const res = await client.get<ReceiveGoodsResponse>(
    `/procurement/receive-goods/${id}`
  );
  return res.data;
}
