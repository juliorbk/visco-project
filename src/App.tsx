import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import LoginPage from "./LoginPage";
import DashboardPage from "./pages/Dashboard";
import ProductsPage from "./pages/Inventory";
import PurchaseOrdersPage from "./PurchaseOrdersPage";
import InboundPage from "./InboundPage";
import SuppliersPage from "./pages/Suppliers";
import ReportsPage from "./pages/Reports";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected (require token) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/inventory" element={<ProductsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/procurement" element={<Navigate to="/procurement/orders" replace />} />
              <Route path="/procurement/orders" element={<PurchaseOrdersPage />} />
              <Route path="/procurement/receipts" element={<InboundPage />} />

              {/* Suppliers — ADMIN, MANAGER, PROCUREMENT only */}
              <Route element={<ProtectedRoute roles={["ADMIN", "MANAGER", "PROCUREMENT"]} />}>
                <Route path="/suppliers" element={<SuppliersPage />} />
              </Route>

              {/* Reports — ADMIN, MANAGER only */}
              <Route element={<ProtectedRoute roles={["ADMIN", "MANAGER"]} />}>
                <Route path="/reports" element={<ReportsPage />} />
              </Route>

              {/* User registration — ADMIN only */}
              <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
                <Route path="/register" element={<Register />} />
              </Route>
            </Route>
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
