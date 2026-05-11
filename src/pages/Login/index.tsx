import { useState } from "react";

const PRIMARY = "#7B1A1A";
const PRIMARY_DARK = "#5C1212";
const PRIMARY_LIGHT = "#FDF0F0";

// SVG Logo inline — matches the uploaded mark exactly
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
    <svg
      width={size * 2.8}
      height={size}
      viewBox="0 0 160 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* VISCO */}
      <text
        x="0"
        y="26"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="26"
        fill={color}
        letterSpacing="1"
      >
        V
      </text>
      {/* vertical bar after V */}
      <rect x="22" y="2" width="2.5" height="24" fill={barColor} />
      <text
        x="28"
        y="26"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="26"
        fill={color}
        letterSpacing="1"
      >
        SCO
      </text>
      {/* ORINOCO */}
      <text
        x="0"
        y="54"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="26"
        fill={color}
        letterSpacing="1"
      >
        OR
      </text>
      {/* vertical bar in ORINOCO */}
      <rect x="42" y="30" width="2.5" height="24" fill={barColor} />
      <text
        x="48"
        y="54"
        fontFamily="Georgia, 'Times New Roman', serif"
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(""); // Limpiamos errores previos

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Enviamos el email y el password tal como los espera tu LoginRequest DTO
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Si Spring Boot devuelve un 403 o 401 (Bad Credentials)
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();

      // 1. Guardamos el JWT en el localStorage del navegador
      localStorage.setItem("visco_token", data.token); // Ajusta "data.token" según el nombre exacto de la variable en tu AuthResponse

      // 2. Redirigimos al usuario al dashboard
      // (Si usas react-router-dom, es mejor usar el hook useNavigate() aquí)
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrorMsg("Correo o contraseña incorrectos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Crimson Text', Georgia, serif",
        background: "#F5F5F7",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .login-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #E5E7EB;
          border-radius: 10px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-input:focus {
          border-color: ${PRIMARY};
          box-shadow: 0 0 0 3px rgba(123,26,26,0.08);
        }
        .login-input::placeholder { color: #9CA3AF; }
        .login-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }
        .login-btn-primary {
          background: ${PRIMARY};
          color: #fff;
        }
        .login-btn-primary:hover { background: ${PRIMARY_DARK}; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(123,26,26,0.25); }
        .login-btn-primary:active { transform: translateY(0); }
        .login-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .spin {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .panel-fade-in {
          animation: fadeUp 0.55s cubic-bezier(.22,.68,0,1.2) both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stat-chip {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 12px 16px;
          backdrop-filter: blur(8px);
        }
        .link-red { color: ${PRIMARY}; text-decoration: none; font-weight: 600; font-family: 'DM Sans', sans-serif; }
        .link-red:hover { text-decoration: underline; }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div
        style={{
          width: "48%",
          background: `linear-gradient(155deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 45%, #A0302A 100%)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 52px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative geometric shapes */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 180,
            height: 180,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        />
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
        {/* Fine grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <ViscoLogo size={42} light />
          <p
            style={{
              marginTop: 12,
              color: "rgba(255,255,255,0.55)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Enterprise Tier
          </p>
        </div>

        {/* Center copy */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "'Crimson Text', Georgia, serif",
              fontStyle: "italic",
              fontSize: 42,
              fontWeight: 400,
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            Gestión de compras
            <br />
            <span style={{ color: "rgba(255,255,255,0.55)" }}>
              inteligente y eficiente.
            </span>
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              maxWidth: 340,
            }}
          >
            Controla inventario, proveedores y órdenes de compra desde una sola
            plataforma empresarial.
          </p>
        </div>

        {/* Stats */}
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
                    fontFamily: "'DM Sans', sans-serif",
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
                    fontFamily: "'DM Sans', sans-serif",
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
          padding: "48px 40px",
          background: "#F5F5F7",
        }}
      >
        <div className="panel-fade-in" style={{ width: "100%", maxWidth: 400 }}>
          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h1
              style={{
                fontFamily: "'Crimson Text', Georgia, serif",
                fontSize: 34,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 6,
              }}
            >
              Bienvenido de vuelta
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "#9CA3AF",
              }}
            >
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
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
                Correo electrónico
              </label>
              <div style={{ position: "relative" }}>
                <svg
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                  }}
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
                <input
                  className="login-input"
                  type="email"
                  placeholder="usuario@viscoorinoco.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 12 }}>
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
                Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <svg
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                  }}
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  className="login-input"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: 40, paddingRight: 44 }}
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
            </div>

            {/* Remember + Forgot */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 28,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                <div
                  onClick={() => setRemember((v) => !v)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    border: `1.5px solid ${remember ? PRIMARY : "#D1D5DB"}`,
                    background: remember ? PRIMARY : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                >
                  {remember && (
                    <svg
                      width="10"
                      height="10"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                Recordarme
              </label>
              <a href="#" className="link-red" style={{ fontSize: 13 }}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-btn login-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spin" />
                  Iniciando sesión…
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "28px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: "#9CA3AF",
              }}
            >
              o continúa con
            </span>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>

          {/* SSO */}
          <button
            className="login-btn"
            style={{
              background: "#fff",
              border: "1.5px solid #E5E7EB",
              color: "#374151",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar con Google SSO
          </button>

          {/* Footer */}
          <p
            style={{
              textAlign: "center",
              marginTop: 32,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#9CA3AF",
            }}
          >
            ¿No tienes cuenta?{" "}
            <a href="/register" className="link-red">
              Solicitar acceso
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
