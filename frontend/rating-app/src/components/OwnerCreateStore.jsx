import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';

export default function OwnerCreateStore() {
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });
  const [errors, setErrors] = useState({});
  const [validationSummary, setValidationSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const summary = [];

    if (!formData.name.trim()) {
      newErrors.name = 'Store name is required.';
      summary.push('Store name cannot be empty.');
    } else if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Store name must be between 20 and 60 characters.';
      summary.push('Store name length must be 20–60 characters.');
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Store email is required.';
      summary.push('Store email cannot be empty.');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
      summary.push('Invalid email format.');
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Store address is required.';
      summary.push('Store address cannot be empty.');
    } else if (formData.address.length < 10) {
      newErrors.address = 'Address must be at least 10 characters.';
      summary.push('Address is too short.');
    }

    setErrors(newErrors);
    setValidationSummary(summary);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setValidationSummary([]);

    try {
      const result = await api.ownerCreateStore(formData);

      if (result.id) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/owner', {
            state: { storeCreated: true, storeName: result.name },
          });
        }, 3000);
      } else {
        alert(result.message || 'Failed to create store.');
      }
    } catch {
      alert('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 mt-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Register Your Store
      </h1>

      {validationSummary.length > 0 && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-4 mb-6 rounded-lg shadow-sm animate-fadeIn">
          <p className="font-semibold mb-1">Please fix the following errors:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {validationSummary.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
     
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">
            Store Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter store name (20–60 chars)"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
            Store Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="contact@store.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="address">
            Store Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123 Main Street, City"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-semibold rounded-lg text-white shadow-lg transition-all ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Registering...' : 'Register Store'}
        </button>
      </form>

      
      {showPopup && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-fadeInOut">
          <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-semibold text-white">Store Registered Successfully!</p>
              <p className="text-sm opacity-80">Redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
