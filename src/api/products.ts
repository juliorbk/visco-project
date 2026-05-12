import client from "./client";
import type {
  PageResponse,
  ProductRequest,
  ProductResponse,
} from "../index";

export interface ProductsParams {
  page?: number;
  size?: number;
  search?: string;
}

export async function getProducts(
  params: ProductsParams = {}
): Promise<PageResponse<ProductResponse>> {
  const { page = 0, size = 10, search } = params;
  const res = await client.get<PageResponse<ProductResponse>>(
    "/inventory/products",
    { params: { page, size, ...(search ? { search } : {}) } }
  );
  return res.data;
}

export async function getProduct(id: number): Promise<ProductResponse> {
  const res = await client.get<ProductResponse>(`/inventory/products/${id}`);
  return res.data;
}

export async function createProduct(
  data: ProductRequest
): Promise<ProductResponse> {
  const res = await client.post<ProductResponse>("/inventory/products", data);
  return res.data;
}

export async function updateProduct(
  id: number,
  data: ProductRequest
): Promise<ProductResponse> {
  const res = await client.put<ProductResponse>(
    `/inventory/products/${id}`,
    data
  );
  return res.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await client.delete(`/inventory/products/${id}`);
}
