import React, { useState, useEffect, useCallback } from "react";
import Modal from "../../components/Modal";
import ProductForm from "../../components/ProductForm";
import { getProducts, createProduct, updateProduct, deleteProduct, activateProduct } from "../../api/products";
import { getSuppliers } from "../../api/suppliers";
import { getProductStockBreakdown } from "../../api/warehouse";
import client from "../../api/client";
import { useAuth } from "../../contexts/AuthContext";
import type { ProductResponse, ProductRequest, SupplierOption, CategoryOption, ProductStockBreakdown } from "../../index";
import { UOM_LABELS } from "../../utils/labels";

const PRIMARY = "#7B1A1A";

export default function ProductsPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("ADMIN");
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const [modalMode, setModalMode] = useState<"create" | "edit" | "deactivate" | null>(null);
  const [selected, setSelected] = useState<ProductResponse | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [stockBreakdowns, setStockBreakdowns] = useState<Record<number, ProductStockBreakdown>>({});
  const [loadingBreakdown, setLoadingBreakdown] = useState(false);

  const PAGE_SIZE = 10;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts({ page, size: PAGE_SIZE, search: debouncedSearch || undefined });
      setProducts(data.content ?? data as any);
      setTotal(data.totalElements ?? (data as any).length ?? 0);
    } catch {
      // Handle silently; add toast in production
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Fetch suppliers + categories for selects
  useEffect(() => {
    getSuppliers().then((data) => setSuppliers(data.filter((s) => s.active))).catch(() =>
      setSuppliers([{ id: 1, name: "Proveedor Demo", active: true }])
    );
    client.get("/categories").then((r) => setCategories(r.data)).catch(() =>
      setCategories([{ id: 1, name: "Materiales" }])
    );
  }, []);

  const handleCreate = useCallback(async (data: ProductRequest) => {
    setSaving(true);
    try {
      await createProduct(data);
      setModalMode(null);
      fetchProducts();
    } finally {
      setSaving(false);
    }
  }, [fetchProducts]);

  const handleEdit = useCallback(async (data: ProductRequest) => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateProduct(selected.id, data);
      setModalMode(null);
      setSelected(null);
      fetchProducts();
    } finally {
      setSaving(false);
    }
  }, [selected, fetchProducts]);

  const handleDeactivate = useCallback(async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await deleteProduct(selected.id);
      setModalMode(null);
      fetchProducts();
    } finally {
      setSaving(false);
    }
  }, [selected, fetchProducts]);

  const handleActivate = useCallback(async (product: ProductResponse) => {
    try {
      await activateProduct(product.id);
      fetchProducts();
    } catch {
      // keep current
    }
  }, [fetchProducts]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestiona el catálogo de productos del inventario.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setSelected(null); setModalMode("create"); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
            style={{ background: PRIMARY }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo Producto
          </button>
        )}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {/* Search bar */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, SKU…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300"
            />
          </div>
          <span className="text-xs text-gray-400">{total} productos · Stock total: {products.reduce((s, p) => s + p.totalStock, 0)}</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {["", "Código Interno", "SKU", "Nombre", "Categoría", "UOM", "Stock Total", "Stock Pend.", "Proveedor", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-5 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                      Cargando productos…
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-5 py-12 text-center text-sm text-gray-400">
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <React.Fragment key={p.id}>
                    <tr className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-2 py-3.5">
                        <button
                          onClick={async () => {
                            if (expandedId === p.id) {
                              setExpandedId(null);
                              return;
                            }
                            setExpandedId(p.id);
                            if (!stockBreakdowns[p.id]) {
                              setLoadingBreakdown(true);
                              try {
                                const data = await getProductStockBreakdown(p.id);
                                setStockBreakdowns((prev) => ({ ...prev, [p.id]: data }));
                              } catch {}
                              setLoadingBreakdown(false);
                            }
                          }}
                          className="p-1 rounded hover:bg-gray-100 transition-colors"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                            className={`transition-transform ${expandedId === p.id ? "rotate-90" : ""}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-xs font-mono font-semibold" style={{ color: PRIMARY }}>{p.internalCode}</td>
                      <td className="px-5 py-3.5 text-xs font-mono text-gray-500">{p.sku}</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{p.name}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{p.categoryName}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{UOM_LABELS[p.uom]}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${p.totalStock <= p.reorderPoint ? "text-red-600" : "text-gray-900"}`}>
                          {p.totalStock}
                          {p.totalStock <= p.reorderPoint && (
                            <svg width="14" height="14" fill="none" stroke="#EF4444" strokeWidth="2" viewBox="0 0 24 24" aria-label="Stock bajo">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-amber-600 font-semibold">{p.totalPendingStock}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{p.supplierName}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${p.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.active ? "bg-green-500" : "bg-gray-400"}`} />
                          {p.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {isAdmin ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setSelected(p); setModalMode("edit"); }}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:shadow-sm"
                              style={{ background: "#6366F1" }}
                            >
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                              Editar
                            </button>
                            {p.active ? (
                              <button
                                onClick={() => { setSelected(p); setModalMode("deactivate"); }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:shadow-sm bg-red-600 hover:bg-red-700"
                              >
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                Desactivar
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivate(p)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:shadow-sm"
                                style={{ background: "#10B981" }}
                              >
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Activar
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                    {expandedId === p.id && (
                      <tr>
                        <td colSpan={11} className="px-5 pb-3">
                          {loadingBreakdown && !stockBreakdowns[p.id] ? (
                            <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
                              <div className="w-3 h-3 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                              Cargando stock por almacén…
                            </div>
                          ) : stockBreakdowns[p.id]?.warehouses.length === 0 ? (
                            <div className="text-xs text-gray-400 py-2">Sin stock registrado por almacén.</div>
                          ) : (
                            <div className="bg-gray-50 rounded-xl p-3">
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Stock por Almacén</div>
                              <div className="grid gap-1.5 text-xs" style={{ gridTemplateColumns: "1fr 80px 80px" }}>
                                <span className="font-semibold text-gray-400">Almacén</span>
                                <span className="font-semibold text-gray-400 text-right">Físico</span>
                                <span className="font-semibold text-gray-400 text-right">Pendiente</span>
                                {stockBreakdowns[p.id]?.warehouses.map((w) => (
                                  <>
                                    <span className="text-gray-700">{w.warehouseName}</span>
                                    <span className="text-gray-800 font-semibold text-right">{w.currentStock}</span>
                                    <span className="text-amber-600 font-semibold text-right">{w.pendingStock}</span>
                                  </>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Página {page + 1} de {totalPages}</span>
            <div className="flex items-center gap-2">
              <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium disabled:opacity-40 hover:bg-gray-50 hover:text-gray-700 transition-all">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Anterior
              </button>
              <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium disabled:opacity-40 hover:bg-gray-50 hover:text-gray-700 transition-all">
                Siguiente
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create modal */}
      <Modal open={modalMode === "create"} onClose={() => setModalMode(null)} title="Nuevo Producto" size="lg">
        <ProductForm
          suppliers={suppliers}
          categories={categories}
          onSubmit={handleCreate}
          onCancel={() => setModalMode(null)}
          loading={saving}
        />
      </Modal>

      {/* Edit modal */}
      <Modal open={modalMode === "edit"} onClose={() => setModalMode(null)} title="Editar Producto" size="lg">
        <ProductForm
          initial={selected}
          suppliers={suppliers}
          categories={categories}
          onSubmit={handleEdit}
          onCancel={() => setModalMode(null)}
          loading={saving}
        />
      </Modal>

      {/* Deactivate confirmation modal */}
      <Modal open={modalMode === "deactivate"} onClose={() => setModalMode(null)} title="Desactivar Producto" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg width="26" height="26" fill="none" stroke="#EF4444" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-1">¿Desactivar este producto?</p>
          <p className="text-red-600 font-bold text-base mb-1">{selected?.name}</p>
          <p className="text-gray-400 text-sm mb-6">El producto quedará inactivo y no podrá ser usado en nuevas órdenes.</p>
          <div className="flex gap-3">
            <button onClick={() => setModalMode(null)} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar
            </button>
            <button onClick={handleDeactivate} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all disabled:opacity-60">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              {saving ? "Desactivando…" : "Desactivar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
