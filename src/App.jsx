import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Moon, Sun } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Products from './pages/Products' ;
import Login from './pages/Login';
import Logout from './pages/Logout';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard'; 
import MyOrders from './pages/MyOrders';
import Cart from './pages/Cart';
import Search from './components/search';
import AddressForm from './pages/AddressForm';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import PaymentStatus from './pages/PaymentStatus';
import About from './pages/About';
import Contact from './pages/Contact';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App = () => {
  const location = useLocation();

  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.title = 'Uma Dairy';
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <GoogleOAuthProvider clientId={clientId || ''}>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">

        { /* 🌗 Dark Mode Toggle Button */}
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 text-yellow-500 dark:text-white shadow-lg transition duration-300"
            aria-label="Toggle Dark Mode"
          >
            { darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-grow pt-16">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/admindashboard" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
              <Route path="/myorders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/products" element={<Products />} />
              <Route path="/search" element={<Search />} />
              <Route path="/address" element={<AddressForm />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/ordersuccess" element={<OrderSuccess />} />
              <Route path="/paymentstatus" element={<PaymentStatus />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;

