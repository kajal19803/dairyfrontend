import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '../utils/auth';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  const getPriceNumber = (priceStr) => {
    const match = priceStr.match(/₹(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + getPriceNumber(item.price) * (item.quantity || 1);
  }, 0);

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token && token.trim() !== '' && isTokenValid(token);
  };

  const handlePlaceOrderClick = () => {
    if (!isLoggedIn()) {
      alert('Please login first to place your order.');
      navigate('/login');
      return;
    }
    setShowAddressForm(true);
  };

  const handleProceedCheckoutClick = () => {
    if (!isLoggedIn()) {
      alert('Please login first to proceed to checkout.');
      navigate('/login');
      return;
    }
    navigate('/address'); // or wherever your checkout page is
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();

    if (
      !address.fullName ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zip ||
      !address.phone
    ) {
      alert('Please fill in all address fields.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate('/payment', { state: { address, cartItems, totalPrice } });
    }, 1500);
  };

  if (cartItems.length === 0)
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-xl font-semibold text-gray-800 mb-3">Cart is empty</p>
        <a
          href="/"
          className="text-base text-yellow-700 hover:underline hover:text-yellow-800"
        >
          View products
        </a>
      </div>
    );

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-yellow-900">Your cart</h1>
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
                  onClick={() =>
                    updateQuantity(item.id, (item.quantity || 1) - 1)
                  }
                  disabled={(item.quantity || 1) <= 1}
                  className="px-2 py-1 bg-yellow-700 text-white rounded disabled:opacity-50"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  -
                </button>
                <span>{item.quantity || 1}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.id, (item.quantity || 1) + 1)
                  }
                  className="px-2 py-1 bg-yellow-700 text-white rounded"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to remove "${item.name}" from the cart?`
                  )
                ) {
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

      {!showAddressForm && (
        <div className="mt-6 text-right space-x-4">
          <button
            onClick={handleProceedCheckoutClick}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={handlePlaceOrderClick}
            className="px-6 py-3 rounded text-white font-bold bg-yellow-700 hover:bg-yellow-800"
          >
            Place Order
          </button>
        </div>
      )}

      {showAddressForm && (
        <form
          onSubmit={handleOrderSubmit}
          className="mt-6 max-w-3xl w-full bg-white p-6 rounded shadow"
        >
          <h2 className="text-xl font-semibold mb-4 text-yellow-900">
            Shipping Address
          </h2>

          <input
            type="text"
            name="fullName"
            value={address.fullName}
            onChange={handleInputChange}
            placeholder="Full Name"
            required
            className="w-full border p-2 rounded mb-3"
          />
          <input
            type="text"
            name="street"
            value={address.street}
            onChange={handleInputChange}
            placeholder="Street Address"
            required
            className="w-full border p-2 rounded mb-3"
          />
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleInputChange}
            placeholder="City"
            required
            className="w-full border p-2 rounded mb-3"
          />
          <input
            type="text"
            name="state"
            value={address.state}
            onChange={handleInputChange}
            placeholder="State"
            required
            className="w-full border p-2 rounded mb-3"
          />
          <input
            type="text"
            name="zip"
            value={address.zip}
            onChange={handleInputChange}
            placeholder="ZIP Code"
            required
            className="w-full border p-2 rounded mb-3"
          />
          <input
            type="tel"
            name="phone"
            value={address.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            required
            className="w-full border p-2 rounded mb-3"
          />

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              {loading ? 'Placing order...' : 'Submit Order'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Cart;
