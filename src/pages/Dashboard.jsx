import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        console.log("Token from backend:", token);
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        setUserData({
          email: decoded.email,
          name: decoded.name || '',
        });
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!userData) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="flex flex-col  w-screen h-screen">
      <Navbar />

      <main className="flex-grow w-screen h-screen max-w-3xl mx-auto p-6 mt-6 bg-white shadow rounded">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">
          Welcome {userData.name ? userData.name : 'User'}!
        </h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Account Info</h2>
          <p className="text-gray-700">Email: {userData.email}</p>
          {/* Add more info here if available */}
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
          <p className="text-gray-600 italic">No recent activity found.</p>
          {/* Replace with actual recent activity list */}
        </section>

        <section className="flex space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
