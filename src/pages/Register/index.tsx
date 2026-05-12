import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "../../index";

const PRIMARY = "#7B1A1A";
const PRIMARY_DARK = "#5C1212";

const USER_ROLES: UserRole[] = ["ADMIN", "MANAGER", "PROCUREMENT", "WAREHOUSEMAN"];

// Mirrors RequestingArea entity — fetch from your API in production
const REQUESTING_AREAS = [
  { id: 8, name: "Procurement" },
  { id: 2, name: "Departamento de Compras" },
  { id: 3, name: "Departamento de TI" },
  { id: 4, name: "Departamento de Operaciones" },
];

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole | "";
  areaId: number | "";
}

function ViscoLogo({
  size = 48,
  light = false,
}: {
  size?: number;
  light?: boolean;
}) {
  const color = light ? "#fff" : PRIMARY;
  const barColor = light ? "rgba(255,255,255,0.5)" : "#4a4a4a";
  return (
    <svg width={size * 2.8} height={size} viewBox="0 0 160 58" fill="none">
      <text
        x="0"
        y="26"
        fontFamily="Georgia,'Times New Roman',serif"
        fontWeight="700"
        fontSize="26"
        fill={color}
        letterSpacing="1"
      >
        V
      </text>
      <rect x="22" y="2" width="2.5" height="24" fill={barColor} />
      <text
        x="28"
        y="26"
        fontFamily="Georgia,'Times New Roman',serif"
        fontWeight="700"
        fontSize="26"
        fill={color}
        letterSpacing="1"
      >
        SCO
      </text>
      <text
        x="0"
        y="54"
        fontFamily="Georgia,'Times New Roman',serif"
        fontWeight="700"
        fontSize="26"
        fill={color}
        letterSpacing="1"
      >
        OR
      </text>
      <rect x="42" y="30" width="2.5" height="24" fill={barColor} />
      <text
        x="48"
        y="54"
        fontFamily="Georgia,'Times New Roman',serif"
        fontWeight="700"
        fontSize="26"
        fill={color}
        letterSpacing="1"
      >
        NOCO
      </text>
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        color: "#374151",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

function InputIcon({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        position: "absolute",
        left: 14,
        top: "50%",
        transform: "translateY(-50%)",
        color: "#9CA3AF",
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      {children}
    </span>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    areaId: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterForm | "api", string>>
  >({});

  const set =
    (field: keyof RegisterForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((er) => ({ ...er, [field]: undefined }));
    };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = "El nombre es obligatorio.";
    if (!form.email.trim()) errs.email = "El correo es obligatorio.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Correo inválido.";
    if (!form.password) errs.password = "La contraseña es obligatoria.";
    else if (form.password.length < 8) errs.password = "Mínimo 8 caracteres.";
    if (form.confirmPassword !== form.password)
      errs.confirmPassword = "Las contraseñas no coinciden.";
    if (!form.role) errs.role = "Selecciona un rol.";
    if (!form.areaId) errs.areaId = "Selecciona un área.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        area: { id: form.areaId },
      };

      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 400 || res.status === 401) {
        const data = await res.json().catch(() => ({}));
        setErrors({ api: data.message ?? "Este correo ya está registrado." });
        return;
      }
      if (!res.ok) throw new Error("Server error");

      // On success → redirect to login
      navigate("/login?registered=true");
    } catch {
      setErrors({
        api: "No se pudo conectar con el servidor. Intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const pwColors = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"];
  const pwLabels = ["Débil", "Regular", "Buena", "Fuerte"];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'DM Sans', Arial, sans-serif",
        background: "#F5F5F7",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .reg-input {
          width: 100%; padding: 11px 16px 11px 40px;
          border: 1.5px solid #E5E7EB; border-radius: 10px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: #1a1a1a; background: #fff; outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .reg-input:focus { border-color: ${PRIMARY}; box-shadow: 0 0 0 3px rgba(123,26,26,.08); }
        .reg-input::placeholder { color: #9CA3AF; }
        .reg-input.error { border-color: #EF4444; }
        .reg-select {
          width: 100%; padding: 11px 16px 11px 40px;
          border: 1.5px solid #E5E7EB; border-radius: 10px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: #374151; background: #fff; outline: none; cursor: pointer;
          appearance: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .reg-select:focus { border-color: ${PRIMARY}; box-shadow: 0 0 0 3px rgba(123,26,26,.08); }
        .reg-select.error { border-color: #EF4444; }
        .reg-btn {
          width: 100%; padding: 14px; border-radius: 10px; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          cursor: pointer; transition: all .2s; letter-spacing: .02em;
          background: ${PRIMARY}; color: #fff;
        }
        .reg-btn:hover:not(:disabled) { background: ${PRIMARY_DARK}; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(123,26,26,.25); }
        .reg-btn:active:not(:disabled) { transform: translateY(0); }
        .reg-btn:disabled { opacity: .65; cursor: not-allowed; }
        .spin { display:inline-block; width:16px; height:16px; border:2px solid rgba(255,255,255,.4); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; vertical-align:middle; margin-right:8px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp .55s cubic-bezier(.22,.68,0,1.2) both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .stat-chip { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,.10); border:1px solid rgba(255,255,255,.15); border-radius:12px; padding:12px 16px; backdrop-filter:blur(8px); }
        .err-msg { font-size:12px; color:#EF4444; margin-top:5px; display:block; }
        .link-red { color:${PRIMARY}; text-decoration:none; font-weight:600; }
        .link-red:hover { text-decoration:underline; }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div
        style={{
          width: "42%",
          flexShrink: 0,
          background: `linear-gradient(155deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 45%, #A0302A 100%)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 52px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        {[
          { top: -80, right: -80, size: 320 },
          { top: -30, right: -30, size: 180 },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: c.top,
              right: c.right,
              width: c.size,
              height: c.size,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <ViscoLogo size={42} light />
          <p
            style={{
              marginTop: 12,
              color: "rgba(255,255,255,0.55)",
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Enterprise Tier
          </p>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "'Crimson Text', Georgia, serif",
              fontStyle: "italic",
              fontSize: 40,
              fontWeight: 400,
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            Crea tu cuenta
            <br />
            <span style={{ color: "rgba(255,255,255,0.55)" }}>
              y empieza a gestionar.
            </span>
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              maxWidth: 320,
            }}
          >
            Controla inventario, proveedores y órdenes de compra desde una sola
            plataforma empresarial.
          </p>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {[
            {
              icon: "📦",
              label: "Inventario activo",
              value: "45,910 unidades",
            },
            { icon: "✅", label: "Tasa de cumplimiento", value: "98.2%" },
            { icon: "🤝", label: "Proveedores activos", value: "89 empresas" },
          ].map((s) => (
            <div key={s.label} className="stat-chip">
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#fff",
                    marginTop: 1,
                  }}
                >
                  {s.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          overflowY: "auto",
          background: "#F5F5F7",
        }}
      >
        <div className="fade-up" style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontFamily: "'Crimson Text', Georgia, serif",
                fontSize: 32,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 6,
              }}
            >
              Solicitar acceso
            </h1>
            <p style={{ fontSize: 14, color: "#9CA3AF" }}>
              Completa el formulario para crear tu cuenta en el sistema.
            </p>
          </div>

          {/* API-level error */}
          {errors.api && (
            <div
              style={{
                marginBottom: 20,
                padding: "12px 16px",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ fontSize: 13, color: "#B91C1C" }}>
                {errors.api}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <FieldLabel>Nombre completo</FieldLabel>
              <div style={{ position: "relative" }}>
                <InputIcon>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </InputIcon>
                <input
                  className={`reg-input${errors.name ? " error" : ""}`}
                  type="text"
                  placeholder="Ej. María González"
                  value={form.name}
                  onChange={set("name")}
                />
              </div>
              {errors.name && <span className="err-msg">{errors.name}</span>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <FieldLabel>Correo electrónico</FieldLabel>
              <div style={{ position: "relative" }}>
                <InputIcon>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </InputIcon>
                <input
                  className={`reg-input${errors.email ? " error" : ""}`}
                  type="email"
                  placeholder="usuario@viscoorinoco.com"
                  value={form.email}
                  onChange={set("email")}
                />
              </div>
              {errors.email && <span className="err-msg">{errors.email}</span>}
            </div>

            {/* Role + Area (side by side) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <FieldLabel>Rol</FieldLabel>
                <div style={{ position: "relative" }}>
                  <InputIcon>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </InputIcon>
                  <select
                    className={`reg-select${errors.role ? " error" : ""}`}
                    value={form.role}
                    onChange={set("role")}
                  >
                    <option value="">Seleccionar…</option>
                    {USER_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {/* Chevron */}
                  <span
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#9CA3AF",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
                {errors.role && <span className="err-msg">{errors.role}</span>}
              </div>

              <div>
                <FieldLabel>Área solicitante</FieldLabel>
                <div style={{ position: "relative" }}>
                  <InputIcon>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                    </svg>
                  </InputIcon>
                  <select
                    className={`reg-select${errors.areaId ? " error" : ""}`}
                    value={form.areaId}
                    onChange={set("areaId")}
                  >
                    <option value="">Seleccionar…</option>
                    {REQUESTING_AREAS.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  <span
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#9CA3AF",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
                {errors.areaId && (
                  <span className="err-msg">{errors.areaId}</span>
                )}
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <FieldLabel>Contraseña</FieldLabel>
              <div style={{ position: "relative" }}>
                <InputIcon>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </InputIcon>
                <input
                  className={`reg-input${errors.password ? " error" : ""}`}
                  type={showPass ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={set("password")}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9CA3AF",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 99,
                          background:
                            n <= pwStrength
                              ? pwColors[pwStrength - 1]
                              : "#E5E7EB",
                          transition: "background .3s",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    style={{ fontSize: 11, color: pwColors[pwStrength - 1] }}
                  >
                    {pwLabels[pwStrength - 1]}
                  </span>
                </div>
              )}
              {errors.password && (
                <span className="err-msg">{errors.password}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 28 }}>
              <FieldLabel>Confirmar contraseña</FieldLabel>
              <div style={{ position: "relative" }}>
                <InputIcon>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </InputIcon>
                <input
                  className={`reg-input${errors.confirmPassword ? " error" : ""}`}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repite la contraseña"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9CA3AF",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="err-msg">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="reg-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spin" />
                  Creando cuenta…
                </>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 28,
              fontSize: 13,
              color: "#9CA3AF",
            }}
          >
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="link-red">
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
