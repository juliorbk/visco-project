import client from "./client";
import type {
  ReceiveGoodsRequest,
  ReceiveGoodsResponse,
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
