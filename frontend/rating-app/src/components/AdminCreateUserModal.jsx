import React, { useState } from "react";
import { FiX, FiUserPlus } from "react-icons/fi";
import * as api from "../api";

export default function AdminCreateUserModal({ isOpen, onClose, onUserCreated }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user", 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
       
            const res = await api.adminCreateUser(formData);
            
            if (res.error) {
                setError(res.error.message || "Failed to create user.");
            } else {
                setSuccess(`User "${res.name}" created successfully!`);
                setFormData({ name: "", email: "", password: "", address: "", role: "user" }); 
                onUserCreated(); 
                setTimeout(onClose, 2000); 
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-2xl m-4 w-full max-w-lg transition-all transform duration-300 ease-out">
                <div className="flex justify-between items-center border-b p-5">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <FiUserPlus className="w-5 h-5 mr-2 text-blue-600" />
                        Add New User
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FiX className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">{error}</div>}
                    {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm">{success}</div>}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="user">Normal User</option>
                            <option value="owner">Store Owner</option>
                            <option value="admin">Admin User</option>
                        </select>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}