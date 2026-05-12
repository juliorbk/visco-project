import { useState, useEffect, useCallback } from "react";
import Modal from "../../components/Modal";
import ProductForm from "../../components/ProductForm";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/products";
import client from "../../api/client";
import type { ProductResponse, ProductRequest, SupplierOption, CategoryOption } from "../../index";
import { UOM_LABELS } from "../../utils/labels";

const PRIMARY = "#7B1A1A";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<ProductResponse | null>(null);

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
    client.get("/suppliers").then((r) => setSuppliers(r.data)).catch(() =>
      setSuppliers([{ id: 1, name: "Proveedor Demo" }])
    );
    client.get("/categories").then((r) => setCategories(r.data)).catch(() =>
      setCategories([{ id: 1, name: "Materiales" }])
    );
  }, []);

  const handleCreate = async (data: ProductRequest) => {
    setSaving(true);
    try {
      await createProduct(data);
      setModalMode(null);
      fetchProducts();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (data: ProductRequest) => {
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
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await deleteProduct(selected.id);
      setModalMode(null);
      setSelected(null);
      fetchProducts();
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestiona el catálogo de productos del inventario.</p>
        </div>
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
          <span className="text-xs text-gray-400">{total} productos</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {["Código Interno", "SKU", "Nombre", "Categoría", "UOM", "Proveedor", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                      Cargando productos…
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono font-semibold" style={{ color: PRIMARY }}>{p.internalCode}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-gray-500">{p.sku}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{p.categoryName}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{UOM_LABELS[p.uom]}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{p.supplierName}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${p.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.active ? "bg-green-500" : "bg-gray-400"}`} />
                        {p.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => { setSelected(p); setModalMode("edit"); }}
                          className="text-xs font-semibold hover:underline"
                          style={{ color: PRIMARY }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => { setSelected(p); setModalMode("delete"); }}
                          className="text-xs font-semibold text-red-500 hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
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
              <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 rounded-lg border border-gray-200 text-xs disabled:opacity-40 hover:bg-gray-50">
                ← Anterior
              </button>
              <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded-lg border border-gray-200 text-xs disabled:opacity-40 hover:bg-gray-50">
                Siguiente →
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

      {/* Delete confirmation modal */}
      <Modal open={modalMode === "delete"} onClose={() => setModalMode(null)} title="Eliminar Producto" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg width="26" height="26" fill="none" stroke="#EF4444" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-1">¿Eliminar este producto?</p>
          <p className="text-red-600 font-bold text-base mb-1">{selected?.name}</p>
          <p className="text-gray-400 text-sm mb-6">Esta acción realizará una baja lógica. No se puede deshacer.</p>
          <div className="flex gap-3">
            <button onClick={() => setModalMode(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button onClick={handleDelete} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
              {saving ? "Eliminando…" : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
