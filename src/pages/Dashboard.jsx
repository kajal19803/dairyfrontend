import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditContact, setShowEditContact] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Contact edit state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('https://dairybackend-jxab.onrender.com/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user');

        const data = await res.json();
        setUserData(data); // contains name, email, image, phoneNumber, address etc.

        // Pre-fill phone and address fields for edit form
        setPhoneNumber(data.phoneNumber || '');
        setAddress(data.address || {
          fullName: '',
          street: '',
          city: '',
          state: '',
          zip: '',
        });
      } catch (err) {
        console.error('User fetch error:', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Password change handlers
  const openChangePassword = () => {
    setError('');
    setSuccess('');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowChangePassword(true);
  };

  const closeChangePassword = () => {
    setShowChangePassword(false);
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated');
      return;
    }

    try {
      const res = await fetch('https://dairybackend-jxab.onrender.com/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to change password');
        return;
      }

      setSuccess('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Change password error:', err);
      setError('Something went wrong, try again.');
    }
  };

  // Contact edit handlers
  const openEditContact = () => {
    setError('');
    setSuccess('');
    setShowEditContact(true);
  };

  const closeEditContact = () => {
    setShowEditContact(false);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateContact = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!phoneNumber) {
      setError('Phone number is required');
      return;
    }
    if (!address.fullName || !address.street || !address.city || !address.state || !address.zip) {
      setError('Please fill in all address fields');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated');
      return;
    }

    try {
      const res = await fetch('https://dairybackend-jxab.onrender.com/api/auth/update-contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNumber, address }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to update contact info');
        return;
      }

      setSuccess('Contact info updated successfully!');
      setUserData(data.user);
      setShowEditContact(false);
    } catch (err) {
      console.error('Update contact error:', err);
      setError('Something went wrong, try again.');
    }
  };

  if (!userData) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="flex flex-col w-screen min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto p-6 mt-6 bg-white shadow rounded">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">
          Welcome {userData.name || 'User'}!
        </h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Account Info</h2>
          <p className="text-gray-700">Email: {userData.email}</p>
          <p className="text-gray-700">
            Phone Number: {userData.phoneNumber || 'Not added'}
          </p>
          <p className="text-gray-700 mt-2 font-semibold">Delivery Address:</p>
          {userData.address ? (
            <div className="text-gray-700 ml-4">
              <p>{userData.address.fullName}</p>
              <p>{userData.address.street}</p>
              <p>
                {userData.address.city}, {userData.address.state} - {userData.address.zip}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 ml-4">No address added</p>
          )}

          {userData.image && (
            <img
              src={userData.image}
              alt="User"
              className="w-24 h-24 rounded-full mt-4"
            />
          )}

          <button
            onClick={openEditContact}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {userData.phoneNumber || userData.address ? 'Edit Contact Info' : 'Add Contact Info'}
          </button>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
          <p className="text-gray-600 italic">No recent activity found.</p>
        </section>

        <section className="flex space-x-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Profile
          </button>
          <button
            onClick={openChangePassword}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </section>
      </main>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>

            {error && <p className="text-red-600 mb-3">{error}</p>}
            {success && <p className="text-green-600 mb-3">{success}</p>}

            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full mb-3 p-2 border bg-white border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-3 p-2 border bg-white border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-3 p-2 border bg-white border-gray-300 rounded"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeChangePassword}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {showEditContact && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-96 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Update Contact Info</h3>

            {error && <p className="text-red-600 mb-3">{error}</p>}
            {success && <p className="text-green-600 mb-3">{success}</p>}

            <label className="block mb-1 font-semibold">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full mb-3 p-2 border bg-white border-gray-300 rounded"
              placeholder="+91XXXXXXXXXX"
            />

            <label className="block mb-1 font-semibold">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={address.fullName}
              onChange={handleContactChange}
              className="w-full mb-3 p-2 border bg-white border-gray-300 rounded"
            />

            <label className="block mb-1 font-semibold">Street</label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleContactChange}
              className="w-full mb-3 p-2 border bg-white border-gray-300 rounded"
            />

            <label className="block mb-1 font-semibold">City</label>
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleContactChange}
              className="w-full mb-3 p-2 border bg-white border-gray-300 rounded"
            />

            <label className="block mb-1 font-semibold">State</label>
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={handleContactChange}
              className="w-full mb-3 p-2 border bg-white border-gray-300 rounded"
            />

            <label className="block mb-1 font-semibold">ZIP Code</label>
            <input
              type="text"
              name="zip"
              value={address.zip}
              onChange={handleContactChange}
              className="w-full mb-3 p-2 border bg-white border-gray-300 rounded"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeEditContact}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateContact}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;

