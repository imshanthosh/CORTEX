/**
 * App Root — Routing Architecture
 *
 * Route structure:
 *   /                → Landing (public)
 *   /login           → Login (public, redirects to /dashboard if logged in)
 *   /dashboard       → Dashboard (protected, inside DashboardLayout)
 *   /aegis           → AEGIS Monitor (protected)
 *   /marine          → Marine Monitor (protected)
 *   /cascade         → Cascade Simulator (protected)
 *   /aquahear        → AquaHear (protected)
 *   /alerts          → Alerts Center (protected)
 *   /reports         → Reports (protected)
 *   *                → Redirect to /
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DashboardLayout from './components/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AegisMonitor from './pages/AegisMonitor';
import MarineMonitor from './pages/MarineMonitor';
import CascadeSimulator from './pages/CascadeSimulator';
import AquaHear from './pages/AquaHear';
import AlertsCenter from './pages/AlertsCenter';
import Reports from './pages/Reports';

export default function App() {
  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* ── Protected routes (inside DashboardLayout) ── */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aegis" element={<AegisMonitor />} />
        <Route path="/marine" element={<MarineMonitor />} />
        <Route path="/cascade" element={<CascadeSimulator />} />
        <Route path="/aquahear" element={<AquaHear />} />
        <Route path="/alerts" element={<AlertsCenter />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      {/* ── Catch-all ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
