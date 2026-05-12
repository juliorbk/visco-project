// ─── Auth ────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  areaId?: number;
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  area?: { id: number; name: string };
}

// ─── Enums ───────────────────────────────────────────────────────────────────
export type UserRole = "ADMIN" | "MANAGER" | "PROCUREMENT" | "WAREHOUSEMAN";

export type Uom =
  | "UNIDAD"
  | "CAJA"
  | "PAQUETE"
  | "LITRO"
  | "KILOGRAMO"
  | "GALON"
  | "METRO";

export type PaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "CHECK"
  | "USDT"
  | "PAYPAL";

export type PurchaseOrderType =
  | "SERVICES"
  | "MATERIALS"
  | "MRO"
  | "CAPITAL_EQUIPMENT";

export type PurchaseOrderStatus =
  | "PENDING"
  | "APPROVED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "PARTIALLY_DELIVERED"
  | "CANCELLED"
  | "REJECTED";

// ─── Products ────────────────────────────────────────────────────────────────
export interface ProductResponse {
  id: number;
  internalCode: string;
  sku: string;
  name: string;
  description: string;
  sapCode: string;
  uom: Uom;
  reorderPoint: number;
  active: boolean;
  supplierId: number;
  supplierName: string;
  categoryId: number;
  categoryName: string;
}

export interface ProductRequest {
  name: string;
  sku: string;
  description: string;
  sapCode: string;
  uom: Uom;
  reorderPoint: number;
  supplier: { id: number };
  category: { id: number };
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ─── Procurement ─────────────────────────────────────────────────────────────
export interface PurchaseOrderItemRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrderRequest {
  orderNumber: string;
  description: string;
  supplierId: number;
  paymentMethod: PaymentMethod;
  type: PurchaseOrderType;
  createdById: string;
  items: PurchaseOrderItemRequest[];
}

export interface PurchaseOrderItemResponse {
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseOrderResponse {
  id: number;
  orderNumber: string;
  description: string;
  status: PurchaseOrderStatus;
  supplierName: string;
  paymentMethod: PaymentMethod;
  type: PurchaseOrderType;
  createdBy: string;
  createdAt: string;
  items: PurchaseOrderItemResponse[];
}

export interface ReceiveItemRequest {
  productId: number;
  receivedQuantity: number;
}

export interface ReceiveGoodsRequest {
  items: ReceiveItemRequest[];
  notes?: string;
}

export interface ReceiveItemResponse {
  productId: number;
  productName: string;
  productSku: string;
  expectedQuantity: number;
  receivedQuantity: number;
  difference: number;
}

export interface ReceiveGoodsResponse {
  id: number;
  receiptNumber: string;
  purchaseOrderId: number;
  orderNumber: string;
  updatedStatus: PurchaseOrderStatus;
  receivedAt: string;
  notes?: string;
  items: ReceiveItemResponse[];
}

// ─── Supplier (for selects) ──────────────────────────────────────────────────
export interface SupplierOption {
  id: number;
  name: string;
  active: boolean;
}

export interface SupplierResponse {
  id: number;
  name: string;
  description: string;
  address: string;
  currency: string;
  contactEmail: string;
  phoneNumbers: string[];
  active: boolean;
  sapCode: string;
  representatives: { id: number; fullName: string }[];
}

export interface SupplierRequest {
  name: string;
  description: string;
  address: string;
  currency: string;
  email: string;
  phoneNumbers: string[];
  sapCode: string;
}

export interface CategoryOption {
  id: number;
  name: string;
}
