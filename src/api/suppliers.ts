import client from "./client";
import type { PageResponse, SupplierRequest, SupplierResponse } from "../index";

export async function getSuppliers(): Promise<SupplierResponse[]> {
  const res = await client.get<PageResponse<SupplierResponse>>("/suppliers", {
    params: { page: 0, size: 1000 },
  });
  return res.data.content;
}

export async function getSuppliersPage(page = 0, size = 10): Promise<PageResponse<SupplierResponse>> {
  const res = await client.get<PageResponse<SupplierResponse>>("/suppliers", {
    params: { page, size },
  });
  return res.data;
}

export async function getSupplier(id: number): Promise<SupplierResponse> {
  const res = await client.get<SupplierResponse>(`/suppliers/${id}`);
  return res.data;
}

export async function createSupplier(data: SupplierRequest): Promise<SupplierResponse> {
  const res = await client.post<SupplierResponse>("/suppliers", data);
  return res.data;
}

export async function updateSupplier(id: number, data: SupplierRequest): Promise<SupplierResponse> {
  const res = await client.put<SupplierResponse>(`/suppliers/${id}`, data);
  return res.data;
}

export async function deactivateSupplier(id: number): Promise<void> {
  await client.delete(`/suppliers/${id}`);
}

export async function activateSupplier(id: number): Promise<void> {
  await client.patch(`/suppliers/${id}/activate`);
}
