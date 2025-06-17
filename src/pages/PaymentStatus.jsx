import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function PaymentStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const order_status = params.get('order_status');
    const order_id = params.get('order_id');

    setStatus(order_status);
    setOrderId(order_id);

    if (order_status === 'PAID' || order_status === 'SUCCESS') {
      clearCart();
      
      setTimeout(() => {
        navigate('/myorders');
      }, 3000);
    }
  }, [location.search, clearCart, navigate]);

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      {status === 'PAID' || status === 'SUCCESS' ? (
        <>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
          <p>Thank you for your order. Order ID: {orderId}</p>
          <p>Redirecting to your orders page...</p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed or Cancelled</h2>
          <p>Please try again or contact support.</p>
        </>
      )}
    </div>
  );
}

export default PaymentStatus;

