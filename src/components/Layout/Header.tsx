import { useAuth } from "../../contexts/AuthContext";
import { ROLE_LABELS } from "../../utils/labels";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
      {/* Left: user info */}
      <div className="flex items-center gap-3 flex-1">
        {user && (
          <>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#7B1A1A" }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-800 truncate">{user.name}</div>
              <div className="text-xs text-gray-400">{ROLE_LABELS[user.role]}</div>
            </div>
          </>
        )}
      </div>

      {/* Right: logout */}
      <div className="flex items-center gap-3">
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Salir
        </button>
      </div>
    </header>
  );
}
