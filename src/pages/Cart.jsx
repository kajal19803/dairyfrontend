import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const getPriceNumber = (priceStr) => {
    const match = priceStr.match(/₹(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + getPriceNumber(item.price) * (item.quantity || 1);
  }, 0);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      clearCart();
      setOrderPlaced(true);
    }, 1500);
  };

  if (orderPlaced) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Congratulations!! your Order has been Placed.</h2>
        <a href="/" className="text-yellow-700 hover:underline">Proceed to Buy</a>
      </div>
    );
  }

  if (cartItems.length === 0)
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-xl font-semibold text-gray-800 mb-3">Cart is empty</p>
        <a href="/" className="text-base text-yellow-700 hover:underline hover:text-yellow-800">
          view products
        </a>
      </div>
    );

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-yellow-900">your cart</h1>
      <div className="w-full max-w-3xl space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center border rounded p-3 shadow-sm bg-white"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-grow ml-4">
              <h2 className="text-lg font-semibold text-blue-700">{item.name}</h2>
              <p className="text-sm text-gray-700">{item.description}</p>
              <p className="text-green-800 font-semibold mt-1">{item.price}</p>
              <p className="text-gray-600 text-sm">Quantity: {item.quantity || 1}</p>

              <div className="mt-2 flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                  disabled={(item.quantity || 1) <= 1}
                  className="px-2 py-1 bg-yellow-700 text-white rounded disabled:opacity-50"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  -
                </button>
                <span>{item.quantity || 1}</span>
                <button
                  onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                  className="px-2 py-1 bg-yellow-700 text-white rounded"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                const confirmDelete = window.confirm(`Are you sure you want to remove "${item.name}" from the cart?`);
                if (confirmDelete) {
                   removeFromCart(item.id);
                 }
               }}
              className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              aria-label={`Remove ${item.name} from cart`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 w-full max-w-3xl text-right text-xl font-bold text-yellow-900">
        Total price: ₹{totalPrice}
      </div>
      <div className="mt-6 text-right">
        <button
          onClick={() => navigate('/address')}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Proceed to Checkout
        </button>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className={`mt-6 px-6 py-3 rounded text-white font-bold ${
          loading ? 'bg-yellow-400 cursor-not-allowed' : 'bg-yellow-700 hover:bg-yellow-800'
        }`}
      >
        {loading ? 'Order is being placed...' : 'Place Order'}
      </button>
    </div>
  );
};

export default Cart;
