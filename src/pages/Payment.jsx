import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  const { address: passedAddress, cartItems, totalPrice } = location.state || {};

  const [name, setName] = useState(passedAddress?.fullName || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(passedAddress?.phone || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!passedAddress || !cartItems || totalPrice === undefined) {
      navigate('/cart');
    }
  }, [passedAddress, cartItems, totalPrice, navigate]);

  const handlePayment = async () => {
    if (!name || !email || !phone) {
      alert('Please fill all customer details');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_BASE_URL}/api/orders/payment/create-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: totalPrice,
          phone,
          email,
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.payment_link) {
        alert('Payment link creation failed');
        setLoading(false);
        return;
      }

      clearCart();
      alert("Redirecting to payment gateway...");

      window.location.href = data.payment_link; // ✅ Just redirect to Cashfree's payment page

    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment request failed');
    }

    setLoading(false);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4 text-yellow-900">Payment Page</h2>

      <div className="mb-6 bg-white p-4 rounded shadow w-full max-w-md">
        <h3 className="font-semibold mb-2 text-gray-900">Customer Details:</h3>

        <label className="block mb-1 text-gray-700">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          placeholder="Enter your name"
          required
        />

        <label className="block mb-1 text-gray-700">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          placeholder="Enter your email"
          required
        />

        <label className="block mb-1 text-gray-700">Phone:</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          placeholder="Enter your phone"
          required
        />
      </div>

      <div className="mb-6 text-xl font-semibold text-yellow-900">
        Total Amount to Pay: ₹{totalPrice?.toFixed(2)}
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-yellow-800 text-white px-6 py-3 rounded hover:bg-yellow-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default Payment;


