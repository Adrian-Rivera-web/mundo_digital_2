import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/shop/HomePage';
import { CatalogPage } from './pages/shop/CatalogPage';
import { ProductDetailsPage } from './pages/shop/ProductDetailsPage';
import { BitsStorePage } from './pages/shop/BitsStorePage';
import { CartPage } from './pages/shop/CartPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { OrderSuccessPage } from './pages/checkout/OrderSuccessPage';
import { AdminGuard } from './components/auth/AdminGuard';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/DashboardPage';
import { OrdersPage } from './pages/admin/OrdersPage';
import { ProductsPage } from './pages/admin/ProductsPage';
import { ProductEditPage } from './pages/admin/ProductEditPage';
import { AboutPage } from './pages/static/AboutPage';
import { ContactPage } from './pages/static/ContactPage';

import { BlogListPage } from './pages/blog/BlogListPage';
import { BlogDetailsPage } from './pages/blog/BlogDetailsPage';
import { UsersPage } from './pages/admin/UsersPage';
import { InvoicesPage } from './pages/admin/InvoicesPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';
import { ProfilePage } from './pages/profile/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<CatalogPage />} />
              <Route path="product/:id" element={<ProductDetailsPage />} />
              <Route path="blog" element={<BlogListPage />} />
              <Route path="blog/:id" element={<BlogDetailsPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-success/:id" element={<OrderSuccessPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="bits-store" element={<BitsStorePage />} />
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
                <Route path="users" element={<UsersPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
