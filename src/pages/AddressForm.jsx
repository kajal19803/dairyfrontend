import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddressForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some(val => val.trim() === '')) {
      alert('Please fill in all fields');
      return;
    }

    // Address info can be saved to localStorage or context here if needed
    localStorage.setItem('deliveryAddress', JSON.stringify(form));

    // Navigate to Payment page after address submission
    navigate('/payment');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-yellow-900">Delivery Address</h2>

        {['name', 'phone', 'address', 'city', 'state', 'pincode'].map(field => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            className="w-full border px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-700"
          />
        ))}

        <button
          type="submit"
          className="mt-4 w-full bg-yellow-800 text-white py-2 rounded hover:bg-yellow-700"
        >
          Confirm Address & Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default AddressForm;

