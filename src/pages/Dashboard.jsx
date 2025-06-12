import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useUserStore from '../store/userStore';
import { FaHeart } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Dashboard = () => {
  const { user, setUser } = useUserStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [addresses, setAddresses] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState({
    fullName: '', street: '', city: '', state: '', zip: ''
  });
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/login');

    const fetchUserAndWishlist = async () => {
      try {
        const userRes = await fetch(`${API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!userRes.ok) throw new Error('User fetch failed');
        const userData = await userRes.json();
        setUser(userData);
        setAddresses(userData.address || []);
        setPhoneNumbers(userData.phoneNumber || []);

        const wishlistRes = await fetch(`${API_URL}/api/auth/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!wishlistRes.ok) throw new Error('Wishlist fetch failed');
        const wishlistData = await wishlistRes.json();
        setWishlist(wishlistData.wishlist || []);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserAndWishlist();
  }, [navigate, setUser]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/payment/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Orders fetch failed');
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Fetch orders failed', err);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  const updateContact = async (updatedPhones, updatedAddresses) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/update-contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ phoneNumbers: updatedPhones, addresses: updatedAddresses })
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.user.address);
        setPhoneNumbers(data.user.phoneNumber);
      }
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleAddPhone = () => {
    if (!newPhone || phoneNumbers.includes(newPhone)) return;
    const updatedPhones = [...phoneNumbers, newPhone];
    updateContact(updatedPhones, addresses);
    setNewPhone('');
  };

  const handleAddAddress = () => {
    if (Object.values(newAddress).some(val => !val)) return;
    const updatedAddresses = [...addresses, newAddress];
    updateContact(phoneNumbers, updatedAddresses);
    setNewAddress({ fullName: '', street: '', city: '', state: '', zip: '' });
  };

  const removePhone = async (phone) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/remove-phone`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ phone })
      });
      if (res.ok) {
        setPhoneNumbers(phoneNumbers.filter(p => p !== phone));
      }
    } catch (err) {
      console.error('Remove phone failed', err);
    }
  };

  const removeAddress = async (addressToRemove) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/remove-address`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ addressToRemove })
      });
      if (res.ok) {
        setAddresses(addresses.filter(a => JSON.stringify(a) !== JSON.stringify(addressToRemove)));
      }
    } catch (err) {
      console.error('Remove address failed', err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/wishlist/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        setWishlist(wishlist.filter(item => item._id !== productId));
      }
    } catch (err) {
      console.error('Remove from wishlist failed', err);
    }
  };

  return (
    <div className="flex w-screen min-h-screen bg-gray-100">
      <Navbar />
      <aside className="w-64 bg-white shadow p-4 space-y-4">
        <h2 className="text-lg font-bold">My Dashboard</h2>
        <button onClick={() => setActiveSection('profile')} className="block bg-white w-full text-left">Profile</button>
        <button onClick={() => setActiveSection('wishlist')} className="block bg-white w-full text-left">Wishlist</button>
        <button onClick={() => setActiveSection('addresses')} className="block bg-white w-full text-left">Addresses</button>
        <button onClick={() => setActiveSection('phones')} className="block bg-white w-full text-left">Phone Numbers</button>
        <button onClick={() => setActiveSection('orders')} className="block bg-white w-full text-left">Orders</button>
      </aside>
      <main className="flex-grow p-6">
        {activeSection === 'profile' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Welcome {user?.name}</h1>
            <p>Email: {user?.email}</p>
          </div>
        )}

        {activeSection === 'wishlist' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-green-700">My Wishlist</h2>
            {wishlist.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map((item, i) => (
                  <div key={item._id || i} className="border bg-white rounded shadow p-4">
                    <Link to={`/product/${item._id}`}>
                      <img
                        src={item.images?.[0]
                          ? item.images[0].startsWith('/uploads')
                            ? `${API_URL}${item.images[0]}`
                            : `${API_URL}/uploads/${item.images[0]}`
                          : '/placeholder.jpg'}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded mb-2"
                        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                      />
                      <h3 className="text-lg font-semibold">{item.name || 'Product Name'}</h3>
                      <p className="text-green-600 font-bold">
                        ₹ {item.price || 'N/A'}{' '}
                        <span className="text-sm text-red-500">({item.discount || 0}% OFF)</span>
                      </p>
                      <p className={`text-sm font-medium ${item.inStock ? 'text-green-600' : 'text-red-500'}`}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="bg-black text-white px-3 py-1 rounded mt-2"
                    >
                      <FaHeart />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No items in wishlist.</p>
            )}
          </div>
        )}

        {activeSection === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">My Orders</h2>
            {orders.length ? (
              <div className="space-y-4">
                {orders.map((order, i) => (
                  <div key={i} className="bg-white border rounded-lg shadow p-4">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-semibold px-2 py-1 rounded ${
                        order.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status?.toUpperCase() || 'PROCESSING'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">Order ID: {order._id}</p>

                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 mt-3">
                        <img
                          src={item.product?.images?.[0]
                            ? item.product.images[0].startsWith('/uploads')
                              ? `${API_URL}${item.product.images[0]}`
                              : `${API_URL}/uploads/${item.product.images[0]}`
                            : '/placeholder.jpg'}
                          alt={item.product?.name || 'Product'}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-bold">{item.product?.name}</h3>
                          <p className="text-sm text-gray-700">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-700">Price: ₹{item.product?.price}</p>
                        </div>
                      </div>
                    ))}

                    <Link
                      to={`/order/${order._id}`}
                      className="text-indigo-600 underline text-sm mt-2 inline-block"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p>No orders placed yet.</p>
            )}
          </div>
        )}

        {activeSection === 'addresses' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Delivery Addresses</h2>
            {addresses.map((addr, i) => (
              <div key={i} className="mb-2 border p-2 rounded">
                <p>{addr.fullName}, {addr.street}</p>
                <p>{addr.city}, {addr.state} - {addr.zip}</p>
                <button onClick={() => removeAddress(addr)} className="text-sm bg-white text-red-600 underline">Remove</button>
              </div>
            ))}
            <h3 className="mt-4 font-semibold">Add New Address</h3>
            <input className="block bg-white mb-2 p-1 border" placeholder="Full Name" value={newAddress.fullName} onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })} />
            <input className="block bg-white mb-2 p-1 border" placeholder="Street" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} />
            <input className="block bg-white mb-2 p-1 border" placeholder="City" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
            <input className="block bg-white mb-2 p-1 border" placeholder="State" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
            <input className="block bg-white mb-2 p-1 border" placeholder="ZIP" value={newAddress.zip} onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })} />
            <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={handleAddAddress}>Add Address</button>
          </div>
        )}

        {activeSection === 'phones' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Phone Numbers</h2>
            {phoneNumbers.map((phone, i) => (
              <div key={i} className="flex justify-between items-center mb-2">
                <p>{phone}</p>
                <button onClick={() => removePhone(phone)} className="text-sm bg-white text-red-600 underline">Remove</button>
              </div>
            ))}
            <input className="block bg-white my-2 p-1 border" placeholder="New Phone Number" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
            <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={handleAddPhone}>Add Phone</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;







