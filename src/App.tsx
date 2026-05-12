import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LoginPage from "./LoginPage";
import DashboardPage from "./pages/Dashboard";
import ProductsPage from "./pages/Inventory";
import PurchaseOrdersPage from "./PurchaseOrdersPage";
import SuppliersPage from "./pages/Suppliers";
import ReportsPage from "./pages/Reports";

export default function App() {
  return (
    <BrowserRouter>
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
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
