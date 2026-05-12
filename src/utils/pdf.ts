import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { PurchaseOrderResponse } from "../index";
import { ORDER_STATUS_LABELS } from "./labels";

const PRIMARY = "#7B1A1A";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(n: number): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export function generatePurchaseOrderPdf(order: PurchaseOrderResponse): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // ── Header ──
  doc.setFontSize(22);
  doc.setTextColor(PRIMARY);
  doc.setFont("helvetica", "bold");
  doc.text("VISCO ORINOCO", 14, 20);

  doc.setFontSize(9);
  doc.setTextColor("#9CA3AF");
  doc.setFont("helvetica", "normal");
  doc.text("Enterprise Tier", 14, 26);

  // Order number on the right
  doc.setFontSize(13);
  doc.setTextColor(PRIMARY);
  doc.setFont("helvetica", "bold");
  doc.text(`ORDEN DE COMPRA`, pageWidth - 14, 20, { align: "right" });
  doc.setFontSize(11);
  doc.setTextColor("#374151");
  doc.setFont("helvetica", "normal");
  doc.text(order.orderNumber, pageWidth - 14, 27, { align: "right" });

  // ── Separator line ──
  doc.setDrawColor("#E5E7EB");
  doc.line(14, 32, pageWidth - 14, 32);

  // ── Order info ──
  const infoY = 40;
  const labelX = 14;
  const valueX = 58;

  const infoRows: { label: string; value: string }[] = [
    { label: "Proveedor:", value: order.supplierName },
    { label: "Fecha:", value: formatDate(order.createdAt) },
    { label: "Estado:", value: ORDER_STATUS_LABELS[order.status] },
  ];

  if (order.description) {
    infoRows.push({ label: "Descripción:", value: order.description });
  }

  doc.setFontSize(9);
  infoRows.forEach((row, i) => {
    const y = infoY + i * 6;
    doc.setTextColor("#6B7280");
    doc.setFont("helvetica", "bold");
    doc.text(row.label, labelX, y);
    doc.setTextColor("#374151");
    doc.setFont("helvetica", "normal");
    doc.text(row.value, valueX, y);
  });

  // ── Items table ──
  const tableHeadY = infoY + infoRows.length * 6 + 8;

  const tableData = order.items.map((item) => [
    item.productName,
    item.productSku,
    item.quantity.toString(),
    formatCurrency(item.unitPrice),
    formatCurrency(item.subtotal),
  ]);

  const totalAmount = order.items.reduce((sum, i) => sum + i.subtotal, 0);

  autoTable(doc, {
    startY: tableHeadY,
    head: [["Producto", "SKU", "Cantidad", "Precio Unit.", "Subtotal"]],
    body: tableData,
    foot: [
      ["", "", "", "TOTAL", formatCurrency(totalAmount)],
    ],
    theme: "grid",
    headStyles: {
      fillColor: PRIMARY,
      textColor: "#fff",
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: "#374151",
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 30, halign: "right" },
    },
    footStyles: {
      fillColor: "#F9FAFB",
      textColor: PRIMARY,
      fontStyle: "bold",
      fontSize: 9,
      halign: "right",
    },
    margin: { left: 14, right: 14 },
  });

  // ── Footer ──
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(7);
  doc.setTextColor("#9CA3AF");
  doc.setFont("helvetica", "normal");
  const now = new Date().toLocaleString("es-VE");
  doc.text(`Documento generado el: ${now}`, 14, footerY);

  // ── Save ──
  doc.save(`${order.orderNumber}.pdf`);
}
