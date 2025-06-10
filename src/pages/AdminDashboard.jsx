import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const [userList, setUserList] = useState([]);
  const [ordersToday, setOrdersToday] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);

  const [showProductModal, setShowProductModal] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    mrp: '',
    discount: '',
    inStock: true,
    category: '',
    image: null,
  });

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerData, setOfferData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    productName: '',
    discount: '',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('userRole');

    if (!user || role !== 'admin') {
      navigate('/login');
    } else {
      fetchUsers();
      fetchDashboardStats();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setUserList(data.users || []);
      setTotalUsersCount(data.users.length || 0);
    } catch (err) {
      alert('Error fetching user list');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/admin/dashboard-stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setOrdersToday(data.ordersToday || 0);
    } catch (err) {
      alert('Error fetching dashboard stats');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('mrp', productData.mrp);
    formData.append('discount', productData.discount);
    formData.append('inStock', productData.inStock);
    formData.append('category', productData.category);
    formData.append('image', productData.image);

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/products/add`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      alert('Product added successfully');
      setShowProductModal(false);
      setProductData({
        name: '',
        description: '',
        mrp: '',
        discount: '',
        inStock: true,
        category: '',
        image: null,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();

    const { title, description, imageUrl, productName, discount } = offerData;

    if (!title || !description || !imageUrl || !productName || !discount) {
      alert('Please fill all offer fields');
      return;
    }

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/offers/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(offerData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || error.message);
      }

      alert('Offer uploaded and emails sent successfully!');
      setShowOfferModal(false);
      setOfferData({
        title: '',
        description: '',
        imageUrl: '',
        productName: '',
        discount: '',
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete');
      alert('User deleted');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="w-screen min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Admin Dashboard</h1>
        <p className="text-gray-700 mb-6">
          Welcome, <span className="font-semibold">{user?.name || 'Admin'}</span> ({user?.email})
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-green-100 p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold text-green-800">Total Users</h2>
            <p className="text-2xl text-green-900 mt-2">{totalUsersCount}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold text-green-800">Orders Today</h2>
            <p className="text-2xl text-green-900 mt-2">{ordersToday}</p>
          </div>
          <div>
            <button
              onClick={() => setShowOfferModal(true)}
              className="mb-8 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Upload Offer
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowProductModal(true)}
          className="mb-8 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>

        <div>
          <h2 className="text-2xl font-semibold mb-4">User List</h2>
          <div className="overflow-x-auto max-w-full">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-green-200">
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userList.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  userList.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border">{u.name}</td>
                      <td className="py-2 px-4 border">{u.email}</td>
                      <td className="py-2 px-4 border capitalize">{u.role}</td>
                      <td className="py-2 px-4 border">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg p-6 w-96 relative">
              <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
              <form onSubmit={handleAddProduct} className="space-y-3">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  className="w-full border bg-white px-3 py-2 rounded-md"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  className="w-full border bg-white px-3 py-2 rounded-md"
                  required
                />
                <input
                  type="number"
                  placeholder="MRP"
                  value={productData.mrp}
                  onChange={(e) => setProductData({ ...productData, mrp: e.target.value })}
                  className="w-full border bg-white px-3 py-2 rounded-md"
                  required
                />
                <input
                  type="number"
                  placeholder="Discount (%)"
                  value={productData.discount}
                  onChange={(e) => setProductData({ ...productData, discount: e.target.value })}
                  className="w-full border bg-white px-3 py-2 rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={productData.category}
                  onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                  className="w-full border bg-white px-3 py-2 rounded-md"
                  required
                />
                <input
                  type="file"
                  onChange={(e) => setProductData({ ...productData, image: e.target.files[0] })}
                  className="w-full"
                  accept="image/*"
                  required
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Offer Modal */}
        {showOfferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg p-6 w-96 relative">
              <h3 className="text-xl font-semibold mb-4">Upload New Offer</h3>
              <form onSubmit={handleAddOffer} className="space-y-3">
                <input
                  type="text"
                  placeholder="Offer Title"
                  value={offerData.title}
                  onChange={(e) => setOfferData({ ...offerData, title: e.target.value })}
                  className="w-full border bg-white px-3 py-2 rounded-md"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={offerData.description}
                  onChange={(e) => setOfferData({ ...offerData, description: e.target.value })}
                  className="w-full border bg-white px-3 py-2 rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={offerData.imageUrl}
                  onChange={(e) => setOfferData({ ...offerData, imageUrl: e.target.value })}
                  className="w-full border bg-white px-3 py-2 rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Product Name"
                  value={offerData.productName}
                  onChange={(e) => setOfferData({ ...offerData, productName: e.target.value })}
                  className="w-full border bg-white px-3 py-2 rounded-md"
                  required
                />
                <input
                  type="number"
                  placeholder="Discount (%)"
                  value={offerData.discount}
                  onChange={(e) => setOfferData({ ...offerData, discount: e.target.value })}
                  className="w-full border bg-white px-3 py-2 rounded-md"
                  required
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowOfferModal(false)}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Upload Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

