import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../api/auth";
import type { UserDTO, UserRole } from "../index";

interface AuthContextValue {
  user: UserDTO | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUser(): UserDTO | null {
  try {
    const raw = localStorage.getItem("visco_user");
    return raw ? (JSON.parse(raw) as UserDTO) : null;
  } catch {
    return null;
  }
}

function loadToken(): string | null {
  return localStorage.getItem("visco_token");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDTO | null>(loadUser);
  const [token, setToken] = useState<string | null>(loadToken);

  useEffect(() => {
    const handler = () => {
      localStorage.removeItem("visco_token");
      localStorage.removeItem("visco_user");
      setToken(null);
      setUser(null);
    };
    window.addEventListener("auth:unauthorized", handler);
    return () => window.removeEventListener("auth:unauthorized", handler);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin({ email, password });
    localStorage.setItem("visco_token", data.token);
    localStorage.setItem("visco_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("visco_token");
    localStorage.removeItem("visco_user");
    setToken(null);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
