import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function PaymentStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [isCOD, setIsCOD] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const order_status = params.get('order_status');
    const order_id = params.get('order_id');
    const cod = params.get('cod');

    setStatus(order_status);
    setOrderId(order_id);
    setIsCOD(cod === '1');

    if (order_status === 'PAID' || order_status === 'SUCCESS' || cod === '1') {
      clearCart();
      
    }
  }, [location.search, clearCart, navigate]);

  const isSuccess = status === 'PAID' || status === 'SUCCESS' || isCOD;
return (
  <div
    className={`min-h-screen w-screen flex items-center justify-center p-6 text-center transition-all duration-300 ${
      isSuccess ? 'bg-green-100' : 'bg-yellow-100'
    }`}
  >
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
      {isSuccess ? (
        <>
          <h2 className="text-3xl font-extrabold text-green-700 mb-4">
            ✅ Thanks for your order! 🎉
          </h2>
          <p className="text-lg mb-2">
            Order ID: <strong>{orderId}</strong>
          </p>
          <p className="text-md text-gray-700 mb-4">
            We’ve received your order and will process it shortly.
          </p>
          <p className="text-green-800 font-medium mb-4">
            💚 Uma Dairy appreciates your support!
          </p>
          <button
            onClick={() => navigate('/dashboard?tab=orders')}
            className="mt-4 px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
          >
            📦 Check Your Order Status
          </button>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-extrabold text-yellow-700 mb-4">
            ⚠️ Payment Failed or Cancelled 😕
          </h2>
          <p className="text-md text-gray-700 mb-3">
            Don't worry, you can try again later.
          </p>
          <p className="text-yellow-800 font-medium">
            💛 Uma Dairy is always here for you.
          </p>
        </>
      )}
    </div>
  </div>
);
}

export default PaymentStatus;



