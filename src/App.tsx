import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/shop/HomePage';
import { ProductDetailsPage } from './pages/shop/ProductDetailsPage';
import { CartPage } from './pages/shop/CartPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { OrderSuccessPage } from './pages/checkout/OrderSuccessPage';
import { AdminGuard } from './components/auth/AdminGuard';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/DashboardPage';
import { OrdersPage } from './pages/admin/OrdersPage';
import { ProductsPage } from './pages/admin/ProductsPage';
import { ProductEditPage } from './pages/admin/ProductEditPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:id" element={<ProductDetailsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-success/:id" element={<OrderSuccessPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/new" element={<ProductEditPage />} />
              <Route path="products/edit/:id" element={<ProductEditPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
