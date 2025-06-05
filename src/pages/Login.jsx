import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const API_URL = "https://dairybackend-jxab.onrender.com";

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email';

    if (!formData.password) errs.password = 'Password is required';

    if (!isLogin) {
      if (!formData.name.trim()) errs.name = 'Name is required';
      if (formData.password.length < 6) errs.password = 'Password must be 6+ chars';
      if (formData.confirmPassword !== formData.password) {
        errs.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setLoading(true);
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const res = await axios.post(`${API_URL}/api/auth${endpoint}`, payload);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user || {}));
        toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
        navigate('/dashboard', { replace: true });  // <-- Always redirect to /dashboard
      } else {
        toast.error(res.data.message || 'Auth failed!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user || {}));
          toast.success('Google login successful!');
          navigate('/dashboard', { replace: true });  // <-- Always redirect to /dashboard
        } else {
          toast.error(data.message || 'Google login failed!');
        }
      })
      .catch((err) => {
        console.error('Google login error:', err);
        toast.error('Google login error!');
      });
  };

  const handleGoogleLoginError = () => {
    toast.error('Google login failed!');
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 p-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          {isLogin ? 'Login to Uma Dairy' : 'Register for Uma Dairy'}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email" id="email" name="email" value={formData.email} onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : ''}`} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password" id="password" name="password" value={formData.password} onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.password ? 'border-red-500' : ''}`} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : ''}`} />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleForm} className="text-green-600 hover:underline">
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>

        <div className="mt-6 flex justify-center">
          <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} />
        </div>
      </div>
    </div>
  );
};

export default Login;

