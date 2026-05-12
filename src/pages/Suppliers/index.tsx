import { useState, useEffect, useCallback } from "react";
import Modal from "../../components/Modal";
import { getSuppliersPage, getSupplier, createSupplier, updateSupplier, deactivateSupplier, activateSupplier } from "../../api/suppliers";
import { useAuth } from "../../contexts/AuthContext";
import type { SupplierResponse, SupplierRequest } from "../../index";
import { BuildingOffice2Icon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const PRIMARY = "#7B1A1A";

const ACTIVE_CONFIG = { bg: "#D1FAE5", color: "#065F46", dot: "#10B981", label: "Activo" };
const INACTIVE_CONFIG = { bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF", label: "Inactivo" };

function FormInput({ label, required, ...props }: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input required={required} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all" {...props} />
    </div>
  );
}

function SupplierForm({ initial, onSubmit, onCancel, loading }: {
  initial?: SupplierResponse | null;
  onSubmit: (data: SupplierRequest) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.contactEmail ?? "");
  const [phone, setPhone] = useState(initial?.phoneNumbers?.[0] ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [currency, setCurrency] = useState(initial?.currency ?? "USD");
  const [sapCode, setSapCode] = useState(initial?.sapCode ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      email,
      phoneNumbers: phone ? [phone] : [],
      description,
      address,
      currency,
      sapCode,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormInput label="Nombre" required value={name} onChange={(e) => setName(e.target.value)} />
        <FormInput label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormInput label="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Moneda</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all">
            <option value="USD">USD</option>
            <option value="VED">VED</option>
            <option value="VES">VES</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <FormInput label="Código SAP" value={sapCode} onChange={(e) => setSapCode(e.target.value)} />
        <FormInput label="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-md disabled:opacity-60" style={{ background: PRIMARY }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {loading ? "Guardando…" : initial ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}

export default function Suppliers() {
  const { hasRole } = useAuth();
  const canManage = hasRole("ADMIN", "MANAGER", "PROCUREMENT");

  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selected, setSelected] = useState<SupplierResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalMode, setModalMode] = useState<"create" | "edit" | "deactivate" | null>(null);

  const PAGE_SIZE = 12;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSuppliersPage(page, PAGE_SIZE);
      setSuppliers(data.content ?? []);
      setTotal(data.totalElements ?? 0);
      if (data.content.length > 0 && !selected) setSelected(data.content[0]);
    } catch {
      setError("Error al cargar proveedores.");
    } finally {
      setLoading(false);
    }
  }, [page, selected]);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  const handleSelect = useCallback(async (id: number) => {
    try {
      const data = await getSupplier(id);
      setSelected(data);
    } catch {
      // keep current
    }
  }, []);

  const handleCreate = useCallback(async (data: SupplierRequest) => {
    setSaving(true);
    try {
      await createSupplier(data);
      setModalMode(null);
      setPage(0);
      fetchSuppliers();
    } finally {
      setSaving(false);
    }
  }, [fetchSuppliers]);

  const handleEdit = useCallback(async (data: SupplierRequest) => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateSupplier(selected.id, data);
      setModalMode(null);
      const updated = await getSupplier(selected.id);
      setSelected(updated);
      fetchSuppliers();
    } finally {
      setSaving(false);
    }
  }, [selected, fetchSuppliers]);

  const handleDeactivate = useCallback(async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await deactivateSupplier(selected.id);
      setModalMode(null);
      const updated = await getSupplier(selected.id);
      setSelected(updated);
      fetchSuppliers();
    } finally {
      setSaving(false);
    }
  }, [selected, fetchSuppliers]);

  const handleActivate = useCallback(async () => {
    if (!selected) return;
    try {
      await activateSupplier(selected.id);
      const updated = await getSupplier(selected.id);
      setSelected(updated);
      fetchSuppliers();
    } catch {
      // keep current
    }
  }, [selected, fetchSuppliers]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const filtered = suppliers.filter((s) =>
    !debouncedSearch || s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || s.contactEmail.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-sm font-semibold hover:underline" style={{ color: PRIMARY }}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Directorio de Proveedores</h1>
          <p className="text-sm text-gray-400 mt-1">Gestione sus relaciones comerciales con proveedores.</p>
        </div>
        {canManage && (
          <button onClick={() => { setSelected(null); setModalMode("create"); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md" style={{ background: PRIMARY }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Proveedor
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Buscar por nombre, email…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all" />
      </div>

      {/* Grid + Detail */}
      <div className="grid grid-cols-3 gap-5 items-start">
        {/* Cards */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100" />
                  <div className="w-16 h-5 rounded-full bg-gray-100" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center h-48 text-sm text-gray-400">
              <BuildingOffice2Icon className="w-10 h-10 text-gray-300 mb-2" />
              No se encontraron proveedores.
            </div>
          ) : (
            filtered.map((s) => {
              const ac = s.active ? ACTIVE_CONFIG : INACTIVE_CONFIG;
              const isSelected = selected?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelect(s.id)}
                  className="bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-lg"
                  style={{
                    borderColor: isSelected ? PRIMARY : "#E5E7EB",
                    borderWidth: isSelected ? 2 : 1,
                    boxShadow: isSelected ? `0 0 0 1px ${PRIMARY}20, 0 4px 12px ${PRIMARY}10` : undefined,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${PRIMARY}10` }}>
                      <BuildingOffice2Icon className="w-5 h-5" style={{ color: PRIMARY }} />
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: ac.bg, color: ac.color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: ac.dot }} />
                      {ac.label}
                    </span>
                  </div>
                  <div className="font-bold text-gray-900 text-sm mb-1">{s.name}</div>
                  <div className="text-xs text-gray-400 mb-1">{s.currency} {s.sapCode ? `• ${s.sapCode}` : ""}</div>
                  <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                      {s.contactEmail}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                      {s.phoneNumbers?.[0] || "—"}{s.phoneNumbers?.length > 1 ? ` (+${s.phoneNumbers.length - 1})` : ""}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-xl border border-gray-100 flex flex-col overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <BuildingOffice2Icon className="w-4 h-4 text-gray-400" />
              Detalles del Proveedor
            </span>
          </div>

          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">{loading ? "Cargando…" : "Selecciona un proveedor"}</div>
          ) : (
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-col items-center mb-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: `${PRIMARY}10` }}>
                  <BuildingOffice2Icon className="w-8 h-8" style={{ color: PRIMARY }} />
                </div>
                <div className="font-bold text-gray-900 text-center text-lg">{selected.name}</div>
                <div className="text-xs text-gray-400 text-center mt-0.5">{selected.currency}{selected.sapCode ? ` • ${selected.sapCode}` : ""}</div>
                <div className="mt-2">
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${selected.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${selected.active ? "bg-green-500" : "bg-gray-400"}`} />
                    {selected.active ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="border-t border-gray-50 pt-3 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    <div>
                      <span className="text-gray-400 text-xs">Email</span>
                      <p className="text-gray-900">{selected.contactEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                    <div>
                      <span className="text-gray-400 text-xs">Teléfono(s)</span>
                      {selected.phoneNumbers && selected.phoneNumbers.length > 0 ? (
                        selected.phoneNumbers.map((p, i) => <p key={i} className="text-gray-900">{p}</p>)
                      ) : (
                        <p className="text-gray-400">—</p>
                      )}
                    </div>
                  </div>
                  {selected.representatives && selected.representatives.length > 0 && (
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1" /><circle cx="12" cy="7" r="4" /><path d="M23 20v-1a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                      <div>
                        <span className="text-gray-400 text-xs">Representante(s) Legal(es)</span>
                        {selected.representatives.map((r) => (
                          <p key={r.id} className="text-gray-900">{r.fullName}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    <div>
                      <span className="text-gray-400 text-xs">Dirección</span>
                      <p className="text-gray-900">{selected.address || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" /></svg>
                    <div>
                      <span className="text-gray-400 text-xs">Moneda</span>
                      <p className="text-gray-900">{selected.currency}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><path d="M8 21h8M12 17v4" /></svg>
                    <div>
                      <span className="text-gray-400 text-xs">Código SAP</span>
                      <p className="text-gray-900">{selected.sapCode || "—"}</p>
                    </div>
                  </div>
                  {selected.description && (
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8M16 17H8M10 9H8" /></svg>
                      <div>
                        <span className="text-gray-400 text-xs">Descripción</span>
                        <p className="text-gray-900">{selected.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {selected && canManage && (
            <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
              <button onClick={() => setModalMode("edit")} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:shadow-md" style={{ background: "#6366F1" }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Editar
              </button>
              {selected.active ? (
                <button onClick={() => setModalMode("deactivate")} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:shadow-md bg-red-600 hover:bg-red-700">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Desactivar
                </button>
              ) : (
                <button onClick={handleActivate} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:shadow-md" style={{ background: "#10B981" }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Activar
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Página {page + 1} de {totalPages} ({total} proveedores)</span>
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

      {/* Create modal */}
      <Modal open={modalMode === "create"} onClose={() => setModalMode(null)} title="Nuevo Proveedor" size="lg">
        <SupplierForm onSubmit={handleCreate} onCancel={() => setModalMode(null)} loading={saving} />
      </Modal>

      {/* Edit modal */}
      <Modal open={modalMode === "edit"} onClose={() => setModalMode(null)} title="Editar Proveedor" size="lg">
        <SupplierForm initial={selected} onSubmit={handleEdit} onCancel={() => setModalMode(null)} loading={saving} />
      </Modal>

      {/* Deactivate confirmation */}
      <Modal open={modalMode === "deactivate"} onClose={() => setModalMode(null)} title="Desactivar Proveedor" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg width="26" height="26" fill="none" stroke="#EF4444" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-1">¿Desactivar este proveedor?</p>
          <p className="text-red-600 font-bold text-base mb-1">{selected?.name}</p>
          <p className="text-gray-400 text-sm mb-6">El proveedor quedará inactivo y no podrá ser usado en nuevas órdenes.</p>
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
