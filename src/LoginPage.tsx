import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "./api/auth";
import { ArchiveBoxIcon, CheckCircleIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";

const PRIMARY = "#7B1A1A";
const PRIMARY_DARK = "#5C1212";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login({ email, password });
      localStorage.setItem("visco_token", data.token);
      localStorage.setItem("visco_user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Credenciales inválidas. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen" style={{ fontFamily: "'DM Sans', sans-serif", background: "#F5F5F7" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
        .login-input { width:100%; padding:11px 16px 11px 42px; border:1.5px solid #E5E7EB; border-radius:10px; font-size:14px; font-family:'DM Sans',sans-serif; color:#1a1a1a; background:#fff; outline:none; transition:border-color .2s, box-shadow .2s; }
        .login-input:focus { border-color:${PRIMARY}; box-shadow:0 0 0 3px rgba(123,26,26,.08); }
        .login-input::placeholder { color:#9CA3AF; }
        .spin { display:inline-block; width:16px; height:16px; border:2px solid rgba(255,255,255,.35); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; vertical-align:middle; margin-right:8px; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .fade-up { animation:fadeUp .5s cubic-bezier(.22,.68,0,1.2) both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 p-12 relative overflow-hidden"
        style={{ background: `linear-gradient(155deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 50%, #A0302A 100%)` }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize:"28px 28px", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:-80, right:-80, width:300, height:300, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.07)" }} />
        <div style={{ position:"absolute", bottom:-100, left:-60, width:380, height:380, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.05)" }} />

        <div style={{ position:"relative", zIndex:1 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 text-white font-bold text-lg">V</div>
            <div>
              <div className="font-bold text-white text-base">Visco Orinoco</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Enterprise Tier</div>
            </div>
          </div>
        </div>

        <div style={{ position:"relative", zIndex:1 }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:40, fontWeight:400, color:"#fff", lineHeight:1.2, marginBottom:16 }}>
            Gestión inteligente<br/>
            <span style={{ color:"rgba(255,255,255,0.5)" }}>de compras.</span>
          </h2>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.55)", lineHeight:1.7 }}>
            Controla inventario, proveedores y órdenes<br/>desde una sola plataforma empresarial.
          </p>
        </div>

        <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { icon:<ArchiveBoxIcon className="w-5 h-5 text-white/80" />, label:"Inventario activo", value:"45,910 unidades" },
            { icon:<CheckCircleIcon className="w-5 h-5 text-white/80" />, label:"Tasa de cumplimiento", value:"98.2%" },
            { icon:<BuildingOffice2Icon className="w-5 h-5 text-white/80" />, label:"Proveedores activos", value:"89 empresas" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.12)" }}>
              <span style={{ display:"flex" }}>{s.icon}</span>
              <div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.label}</div>
                <div style={{ fontSize:13, fontWeight:600, color:"#fff" }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="fade-up w-full max-w-sm">
          <div className="mb-8">
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:700, color:"#111827", marginBottom:6 }}>
              Bienvenido de vuelta
            </h1>
            <p style={{ fontSize:14, color:"#9CA3AF" }}>Ingresa tus credenciales para acceder</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl flex items-center gap-2" style={{ background:"#FEF2F2", border:"1px solid #FECACA" }}>
              <svg width="15" height="15" fill="none" stroke="#EF4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style={{ fontSize:13, color:"#B91C1C" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <input className="login-input" type="email" placeholder="usuario@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input className="login-input" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ paddingRight:44 }} />
                <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass
                    ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all"
              style={{ background: loading ? "#9CA3AF" : PRIMARY, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? <><span className="spin" />Iniciando sesión…</> : "Iniciar sesión"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-400">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-semibold" style={{ color: PRIMARY }}>Solicitar acceso</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
