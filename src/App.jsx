import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Pricing from './pages/Pricing';
import Payments from './pages/Payments';
import Customers from './pages/Customers';
import Employees from './pages/Employees';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Admin Routes with Layout */}
            <Route path="/" element={
                <ProtectedRoute allowedRoles={['admin', 'employee']}>
                    <Layout />
                </ProtectedRoute>
            }>

                {/* Redirect Root based on Role */}
                <Route index element={
                    user?.role === 'employee' ? <Navigate to="/my-tasks" replace /> : <Navigate to="/dashboard" replace />
                } />

                {/* Admin Only Routes */}
                <Route path="dashboard" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="orders" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Orders />
                    </ProtectedRoute>
                } />
                <Route path="pricing" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Pricing />
                    </ProtectedRoute>
                } />
                <Route path="payments" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Payments />
                    </ProtectedRoute>
                } />
                <Route path="customers" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Customers />
                    </ProtectedRoute>
                } />
                <Route path="employees" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Employees />
                    </ProtectedRoute>
                } />
                <Route path="reports" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Reports />
                    </ProtectedRoute>
                } />

                {/* Shared Routes */}
                <Route path="settings" element={<Settings />} />

                {/* Employee Routes */}
                <Route path="my-tasks" element={
                    <ProtectedRoute allowedRoles={['employee']}>
                        <EmployeeDashboard />
                    </ProtectedRoute>
                } />
            </Route>
        </Routes>
    );
}

export default App;
