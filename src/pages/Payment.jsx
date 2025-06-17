import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { load } from '@cashfreepayments/cashfree-js';
import useUserStore from '../store/userStore';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { user } = useUserStore();

  const {
    cartItems,
    totalPrice,
    orderId,
    address,
    phone,
  } = location.state || {};

  const [cfInstance, setCfInstance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !cartItems || totalPrice === undefined || !orderId) {
      navigate('/cart');
    }
  }, [user, cartItems, totalPrice, orderId, navigate]);

  useEffect(() => {
    const initCashfree = async () => {
      try {
        const cf = await load({ mode: 'production' });
        setCfInstance(cf);
        console.log('✅ Cashfree SDK loaded');
      } catch (err) {
        console.error('❌ Failed to load Cashfree SDK', err);
      }
    };
    initCashfree();
  }, []);

  const handlePayment = async () => {
    if (!user?.name || !user?.email) {
      alert('User info missing. Please login again.');
      return;
    }

    if (!cfInstance || typeof cfInstance.checkout !== 'function') {
      alert('Cashfree SDK not ready yet. Please wait...');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${BACKEND_BASE_URL}/api/orders/payment/create-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: totalPrice,
          name: user.name,
          email: user.email,
          phone: user.phone,
          order_id: orderId,
        }),
      });

      const data = await res.json();
      console.log('✅ Cashfree backend response:', data);

      if (!res.ok || !data.session_id) {
        alert('Failed to create payment session');
        setLoading(false);
        return;
      }

      cfInstance.checkout({
        paymentSessionId: data.session_id,
        redirect: true,
        returnUrl: `${window.location.origin}/payment-status?order_id=${orderId}`,

      });

    } catch (err) {
      console.error('❌ Payment error:', err);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4 text-yellow-900">Payment Page</h2>

      <div className="mb-6 bg-white p-4 rounded shadow w-full max-w-md">
        <p className="text-sm text-gray-700"><strong>Order ID:</strong> {orderId}</p>
        <div>
          <p className="font-semibold text-yellow-800 mb-2">Items:</p>
          <div className="border rounded">
            {cartItems.map((item, i) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b p-3 text-sm"
              >
                <div className="flex items-center space-x-3">
                  <img src={`${BACKEND_BASE_URL}${item.images[0]}`} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <div>
                    <p className="font-semibold text-blue-700">{item.name}</p>
                    <p className="text-gray-500">Product ID: {item._id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ₹{item.price}</p>
                  <p className="font-semibold text-green-700">Total: ₹{Number(item.price) * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3 className="font-semibold mb-2 text-gray-900 mt-4">Delivery Details</h3>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone:</strong> {phone}</p>

        <p><strong>🏠 Address:</strong></p>
        {typeof address === 'object' ? (
          <p className="ml-2 text-sm text-gray-700">
            {address.street}, {address.city}, {address.state} - {address.pincode}
          </p>
        ) : (
          <p className="ml-2 text-sm text-gray-700">{address}</p>
        )}

        <button
          className="text-blue-600 bg-white underline mt-2"
          onClick={() => navigate('/cart')}
        >
          ✏️ Edit Details
        </button>
      </div>

      <div className="mb-6 text-xl font-semibold text-yellow-900">
        Total Amount to Pay: ₹{totalPrice?.toFixed(2)}
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || !cfInstance}
        className="bg-yellow-800 text-white px-6 py-3 rounded hover:bg-yellow-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>

      <div
        id="cashfree-checkout"
        className="w-full max-w-md mt-6"
        style={{ minHeight: '700px' }}
      />
    </div>
  );
};

export default Payment;

