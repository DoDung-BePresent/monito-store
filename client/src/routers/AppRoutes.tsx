/**
 * Node modules
 */
import { Navigate, Route, Routes } from 'react-router-dom';

/**
 * Layouts
 */
import AuthLayout from '@/layouts/AuthLayout';
import BaseLayout from '@/layouts/BaseLayout';
import StaffLayout from '@/layouts/StaffLayout';
import AdminLayout from '@/layouts/AdminLayout';

/**
 * Components
 */
import { ProtectedRoute } from './components/ProtectedRoute';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';

/**
 * Pages
 */
import HomePage from '@/pages/home/HomePage';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

import StaffDashboard from '@/pages/staff/StaffDashboard';
import ProductsManagement from '@/pages/staff/product/ProductsManagement';
import PetsManagement from '@/pages/staff/pet/PetsManagement';
import OrdersManagement from '@/pages/staff/order/OrdersManagement';
import CategoriesManagement from '@/pages/staff/CategoriesManagement';
import ColorsManagement from '@/pages/staff/ColorsManagement';
import BreedsManagement from '@/pages/staff/breed/BreedsManagement';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import LoadingScreen from '@/pages/common/LoadingScreen';
import AddProduct from '@/pages/staff/product/AddProduct';
import AddPet from '@/pages/staff/pet/AddPet';

const AppRoutes = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<BaseLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Navigate to={`/${user?.role}`} />} />
        <Route path="/register" element={<Navigate to={`/${user?.role}`} />} />
      </Route>

      <Route
        path="/customer/*"
        element={<ProtectedRoute allowedRoles={['customer']} />}
      />
      <Route
        path="/staff/*"
        element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}
      >
        <Route element={<StaffLayout />}>
          <Route index element={<StaffDashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="pets" element={<PetsManagement />} />
          <Route path="pets/add" element={<AddPet />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="colors" element={<ColorsManagement />} />
          <Route path="breeds" element={<BreedsManagement />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={<ProtectedRoute allowedRoles={['admin']} />}
      >
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="staff" element={<div>Staff Management</div>} />
          <Route path="settings" element={<div>Settings</div>} />
          <Route path="database" element={<div>Database</div>} />
          <Route path="analytics" element={<div>Analytics</div>} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={`/${user?.role}`} />} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};
export default AppRoutes;
