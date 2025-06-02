import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Payment = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const address = JSON.parse(localStorage.getItem('deliveryAddress'));
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const amount = 100; // ₹100 example

      const customerDetails = {
        id: 'cust_001',
        email: 'test@example.com', // agar user email input karwaoge to yaha bhej sakte ho
        phone: address?.phone || '9999999999',
        name: address?.name || 'Customer',
      };

      // Step 1: Create payment link
      const res = await fetch('https://dairybackend-jxab.onrender.com/api/payment/create-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, customerDetails }),
      });

      const data = await res.json();

      if (data.payment_link) {
        window.open(data.payment_link, '_blank');

        // Step 2: Simulate payment success after 5 seconds
        setTimeout(async () => {
          alert('Payment successful!');

          // Step 3: Confirm payment backend call
          await fetch('https://dairybackend-jxab.onrender.com/api/payment/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderId, paymentStatus: 'SUCCESS' }),
          });

          clearCart();
          navigate('/ordersuccess');
        }, 5000);
      } else {
        alert('Payment link creation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment request failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4 text-yellow-900">Payment Page</h2>

      {address && (
        <div className="mb-6 bg-white p-4 rounded shadow w-full max-w-md">
          <h3 className="font-semibold mb-2 text-gray-900">Shipping to:</h3>
          <p className="text-gray-900">{address.name}</p>
          <p className="text-gray-900">{address.phone}</p>
          <p className="text-gray-900">{address.address}, {address.city}, {address.state} - {address.pincode}</p>
        </div>
      )}

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




