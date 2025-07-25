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
import BlankLayout from '@/layouts/BlankLayout';

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
import HomePage from '@/pages/main/home/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import StaffDashboard from '@/pages/staff/StaffDashboard';
import ProductsManagement from '@/pages/staff/product/ProductsManagement';
import PetsManagement from '@/pages/staff/pet/PetsManagement';
import OrdersManagement from '@/pages/staff/order/OrdersManagement';
import CategoriesManagement from '@/pages/staff/category/CategoriesManagement';
import ColorsManagement from '@/pages/staff/color/ColorsManagement';
import BreedsManagement from '@/pages/staff/breed/BreedsManagement';
import AddPet from '@/pages/staff/pet/AddPet';
import AdminDashboard from '@/pages/admin/overview/AdminDashboard';
import UserManagement from '@/pages/admin/user/UserManagement';
import LoadingScreen from '@/pages/common/LoadingScreen';
import AddProduct from '@/pages/staff/product/AddProduct';
import StaffManagement from '@/pages/admin/staff/StaffManagement';
import PetDetail from '@/pages/staff/pet/PetDetail';
import EditPet from '@/pages/staff/pet/EditPet';
import PetsPage from '@/pages/main/pets/PetsPage';
import PetDetailPage from '@/pages/main/pets/PetDetailPage';
import ProductsPage from '@/pages/main/products/ProductsPage';
import ProductDetail from '@/pages/staff/product/ProductDetail';
import EditProduct from '@/pages/staff/product/EditProduct';
import ProductDetailPage from '@/pages/main/products/ProductDetailPage';
import NotFoundPage from '@/pages/common/NotFoundPage';
import AboutPage from '@/pages/main/about/AboutPage';
import ContactPage from '@/pages/main/contact/ContactPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import CartPage from '@/pages/customer/CartPage';
import CheckoutPage from '@/pages/customer/CheckoutPage';
import OrdersPage from '@/pages/customer/OrdersPage';
import OrderDetail from '@/pages/staff/order/OrderDetail';
import { PublicRoute } from './components/PublicRoute';

const AppRoutes = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* ✅ Auth Routes - chỉ hiển thị khi chưa đăng nhập */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={`/${user?.role}`} replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to={`/${user?.role}`} replace />
            ) : (
              <RegisterPage />
            )
          }
        />
      </Route>

      <Route path="/reset-password" element={<BlankLayout />}>
        <Route
          index
          element={
            isAuthenticated ? (
              <Navigate to={`/${user?.role}`} replace />
            ) : (
              <ResetPasswordPage />
            )
          }
        />
      </Route>
      <Route path="/forgot-password" element={<BlankLayout />}>
        <Route
          index
          element={
            isAuthenticated ? (
              <Navigate to={`/${user?.role}`} replace />
            ) : (
              <ForgotPasswordPage />
            )
          }
        />
      </Route>

      {/* ✅ Public Routes - ai cũng có thể xem, nhưng navbar khác nhau */}
      <Route element={<PublicRoute />}>
        <Route element={<BaseLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/pets" element={<PetsPage />} />
          <Route path="/pets/:id" element={<PetDetailPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Route>

      {/* ✅ Customer-only Routes - cần đăng nhập */}
      <Route
        path="/customer/*"
        element={<ProtectedRoute allowedRoles={['customer']} />}
      >
        <Route element={<BaseLayout />}>
          <Route index element={<Navigate replace to="/" />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route
            path="orders/:id"
            element={<div>Order Detail Page - Coming Soon</div>}
          />
          <Route
            path="wishlist"
            element={<div>Wishlist Page - Coming Soon</div>}
          />
          <Route
            path="payment"
            element={<div>Payment Page - Coming Soon</div>}
          />
          <Route
            path="settings"
            element={<div>Settings Page - Coming Soon</div>}
          />
          <Route
            path="notifications"
            element={<div>Notifications Page - Coming Soon</div>}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      {/* ✅ Staff Routes */}
      <Route
        path="/staff/*"
        element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}
      >
        <Route element={<StaffLayout />}>
          <Route index element={<StaffDashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="pets" element={<PetsManagement />} />
          <Route path="pets/add" element={<AddPet />} />
          <Route path="pets/:id" element={<PetDetail />} />
          <Route path="pets/:id/edit" element={<EditPet />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="colors" element={<ColorsManagement />} />
          <Route path="breeds" element={<BreedsManagement />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      {/* ✅ Admin Routes */}
      <Route
        path="/admin/*"
        element={<ProtectedRoute allowedRoles={['admin']} />}
      >
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      {/* ✅ Redirect logic */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={`/${user?.role}`} replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
