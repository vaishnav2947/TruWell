import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Services from './pages/Services';
import Appointments from './pages/Appointments';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import OrderSuccess from './pages/OrderSuccess';
import AddMedicine from './pages/AddMedicine';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/services" element={<Services />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/account" element={<Account />} />
                <Route path="/order-success/:id" element={<OrderSuccess />} />
                <Route path="/admin/medicines" element={<AddMedicine />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer position="bottom-right" autoClose={3000} />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
