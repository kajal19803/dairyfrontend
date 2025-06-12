import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { isTokenValid } from '../utils/auth';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

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
  });
  const [phone, setPhone] = useState('');

  const getPriceNumber = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const match = price.match(/\u20B9(\d+(\.\d+)?)/);
      if (match) return parseFloat(match[1]);
      const parsed = parseFloat(price);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + getPriceNumber(item.price) * (item.quantity || 1);
  }, 0);

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token && token.trim() !== '' && isTokenValid(token);
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user data');
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handlePlaceOrderClick = async () => {
    if (!isLoggedIn()) {
      alert('Please login first to place your order.');
      navigate('/login');
      return;
    }

    setLoading(true);
    const userData = await fetchUserData();
    setLoading(false);

    if (!userData) {
      alert('Failed to load user data. Please login again.');
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    const addressData = {
      fullName: userData.address?.fullName,
      street: userData.address?.street,
      city: userData.address?.city,
      state: userData.address?.state,
      zip: userData.address?.zip,
    };

    const phoneData = userData.phoneNumber;

    if (!addressData.fullName || !addressData.street || !addressData.city || !addressData.state || !addressData.zip || !phoneData) {
      setAddress({
        fullName: addressData.fullName || '',
        street: addressData.street || '',
        city: addressData.city || '',
        state: addressData.state || '',
        zip: addressData.zip || '',
      });
      setPhone(phoneData || '');
      setShowAddressForm(true);
      return;
    }

    const token = localStorage.getItem('token');
    const orderPayload = {
      userId: userData._id,
      items: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: getPriceNumber(item.price),
      })),
      totalPrice,
      address: addressData,
      phone: phoneData,
      status: 'Pending',
    };

    console.log('Auto order payload sent to backend:', orderPayload);

    try {
      const orderRes = await fetch(`${BACKEND_BASE_URL}/api/orders/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) throw new Error('Failed to place order');

      const orderData = await orderRes.json();
      localStorage.setItem('latestOrderId', orderData._id);

      clearCart();
      navigate('/payment', {
        state: {
          address: addressData,
          phone: phoneData,
          cartItems,
          totalPrice,
          orderId: orderData._id,
        },
      });
    } catch (error) {
      console.error(error);
      alert('Order placement failed. Try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') setPhone(value);
    else setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const { fullName, street, city, state, zip } = address;

    if (!fullName || !street || !city || !state || !zip || !phone) {
      alert('Please fill in all address fields.');
      return;
    }

    const token = localStorage.getItem('token');
    const userId = JSON.parse(atob(token.split('.')[1])).id;

    try {
      await fetch(`${BACKEND_BASE_URL}/api/auth/update-contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: { fullName, street, city, state, zip },
          phoneNumber: phone,
        }),
      });

      const orderPayload = {
        userId,
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: getPriceNumber(item.price),
        })),
        totalPrice,
        address: { fullName, street, city, state, zip },
        phone,
        status: 'Pending',
      };

      console.log('Order data being sent to backend:', orderPayload);

      const orderRes = await fetch(`${BACKEND_BASE_URL}/api/orders/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) throw new Error('Failed to place order');
      const orderData = await orderRes.json();
      localStorage.setItem('latestOrderId', orderData._id);

      setLoading(false);
      setShowAddressForm(false);
      clearCart();

      navigate('/payment', {
        state: {
          address,
          cartItems,
          totalPrice,
          orderId: orderData._id,
          phone,
        },
      });
    } catch (error) {
      console.error(error);
      alert('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-xl font-semibold text-gray-800 mb-3">Cart is empty</p>
        <Link
          to="/products"
          className="text-base text-yellow-700 hover:underline hover:text-yellow-800"
        >
          View products
        </Link>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-yellow-900">Your cart</h1>
      <div className="w-full max-w-3xl space-y-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center border rounded p-3 shadow-sm bg-white cursor-pointer hover:shadow-md transition"
            onClick={() => navigate(`/product/${item._id}`)}
          >
            <img
              src={`${BACKEND_BASE_URL}${item.image}`}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(item._id, (item.quantity || 1) - 1);
                  }}
                  disabled={(item.quantity || 1) <= 1}
                  className="px-2 py-1 bg-yellow-700 text-white rounded disabled:opacity-50"
                >
                  -
                </button>
                <span>{item.quantity || 1}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(item._id, (item.quantity || 1) + 1);
                  }}
                  className="px-2 py-1 bg-yellow-700 text-white rounded"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Remove "${item.name}" from cart?`)) {
                  removeFromCart(item._id);
                }
              }}
              className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 w-full max-w-3xl text-right text-xl font-bold text-yellow-900">
        Total price: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalPrice)}
      </div>
      {!showAddressForm && (
        <div className="mt-6 text-right space-x-4">
          <button
            onClick={handlePlaceOrderClick}
            className="px-6 py-3 rounded text-white font-bold bg-yellow-700 hover:bg-yellow-800"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Place Order'}
          </button>
        </div>
      )}
      {showAddressForm && (
        <form
          onSubmit={handleOrderSubmit}
          className="mt-6 max-w-3xl w-full bg-white p-6 rounded shadow"
        >
          <h2 className="text-xl font-semibold mb-4 text-yellow-900">Shipping Address</h2>
          {['fullName', 'street', 'city', 'state', 'zip'].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={address[field]}
              onChange={handleInputChange}
              placeholder={field === 'zip' ? 'ZIP Code' : field.charAt(0).toUpperCase() + field.slice(1)}
              required
              className="w-full border p-2 rounded mb-3"
            />
          ))}
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={handleInputChange}
            placeholder="Phone"
            required
            className="w-full border p-2 rounded mb-3"
          />
          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              {loading ? 'Saving...' : 'Submit Order'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Cart;
