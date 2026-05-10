import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import StudentLayout from './components/layout/StudentLayout';
import SellerLayout from './components/layout/SellerLayout';

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from './pages/auth/RegisterPage';

// Student Pages
import StudentHome from './pages/student/Home';
import ProductDetail from './pages/student/ProductDetail';
import StoreDetail from './pages/student/StoreDetail'; // IMPOR BARU
import Cart from './pages/student/Cart';
import Checkout from './pages/student/Checkout';
import Payment from './pages/student/Payment';
import ReviewPage from './pages/student/Review';
import OrderHistory from './pages/student/OrderHistory';

// Seller Pages
import SellerDashboard from './pages/seller/Dashboard';
import SellerInventory from './pages/seller/Inventory';
import SellerOrders from './pages/seller/Orders';
import SellerReviews from './pages/seller/ReviewList';
import SellerPromo from './pages/seller/Promo';
import SellerSettings from './pages/seller/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<StudentLayout />}>
          <Route index element={<StudentHome />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="store/:id" element={<StoreDetail />} /> {/* RUTE BARU */}
          
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment" element={<Payment />} />
          <Route path="/history" element={<OrderHistory />} />
          <Route path="review/:orderId" element={<ReviewPage />} />
        </Route>

        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<Navigate to="/seller/dashboard" replace />} />
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="inventory" element={<SellerInventory />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="reviews" element={<SellerReviews />} />
          <Route path="promo" element={<SellerPromo />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}