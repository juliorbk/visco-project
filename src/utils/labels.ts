import type {
  Uom,
  PaymentMethod,
  PurchaseOrderType,
  PurchaseOrderStatus,
  UserRole,
} from "../index";

export const UOM_LABELS: Record<Uom, string> = {
  UNIDAD: "Unidad",
  CAJA: "Caja",
  PAQUETE: "Paquete",
  LITRO: "Litro",
  KILOGRAMO: "Kilogramo",
  GALON: "Galón",
  METRO: "Metro",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Efectivo",
  BANK_TRANSFER: "Transferencia Bancaria",
  CHECK: "Cheque",
  USDT: "USDT (Crypto)",
  PAYPAL: "PayPal",
};

export const ORDER_TYPE_LABELS: Record<PurchaseOrderType, string> = {
  SERVICES: "Servicios",
  MATERIALS: "Materiales",
  MRO: "MRO",
  CAPITAL_EQUIPMENT: "Equipo de Capital",
};

export const ORDER_STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  PENDING: "Pendiente",
  IN_TRANSIT: "En Tránsito",
  DELIVERED: "Entregado",
  PARTIALLY_DELIVERED: "Parcialmente Entregado",
  CANCELLED: "Cancelado",
};

export const ORDER_STATUS_STYLE: Record<
  PurchaseOrderStatus,
  { bg: string; color: string; dot: string }
> = {
  PENDING: { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  IN_TRANSIT: { bg: "#E0E7FF", color: "#3730A3", dot: "#6366F1" },
  DELIVERED: { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
  PARTIALLY_DELIVERED: { bg: "#FEF9C3", color: "#713F12", dot: "#EAB308" },
  CANCELLED: { bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF" },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  PROCUREMENT: "Compras",
  WAREHOUSEMAN: "Almacenista",
};

export const STATUS_FLOW: PurchaseOrderStatus[] = [
  "PENDING",
  "IN_TRANSIT",
  "PARTIALLY_DELIVERED",
  "DELIVERED",
  "CANCELLED",
];
