import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './components/search';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import Cart from './pages/Cart';
import AddressForm from './pages/AddressForm';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/Privateroute';
import Logout from './pages/Logout';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App = () => {
  const location = useLocation();

  // Hide Navbar & Footer on dashboard route
  const hideNavbarFooter = location.pathname.startsWith('/dashboard');

  // Optional: Update browser tab title dynamically
  useEffect(() => {
    document.title = 'Uma Dairy';
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId || ''}>
      <div className="min-h-screen flex flex-col">
        {!hideNavbarFooter && <Navbar />}
        <div className="flex-grow pt-16">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/search" element={<Search />} />
              <Route path="/address" element={<AddressForm />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/ordersuccess" element={<OrderSuccess />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </ErrorBoundary>
        </div>
        {!hideNavbarFooter && <Footer />}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
