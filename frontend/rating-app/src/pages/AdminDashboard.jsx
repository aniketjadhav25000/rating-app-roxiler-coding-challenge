import React, { useEffect, useState } from "react";
import { FiUsers, FiShoppingBag, FiStar, FiSearch, FiMenu, FiX } from "react-icons/fi";
import * as api from "../api";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userQuery, setUserQuery] = useState("");
    const [storeQuery, setStoreQuery] = useState("");
    const [activeSection, setActiveSection] = useState("overview");

    const loadData = async (userQ = "", storeQ = "") => {
        setLoading(true);
        try {
            const s = await api.getAdminDashboardStats();
            const u = await api.getAdminUsers(userQ);
            const st = await api.getAdminStores(storeQ);
            setStats(s || {});
            setUsers(u || []);
            setStores(st || []);
        } catch (error) {
            console.error("Failed to load admin data:", error);
            setStats({});
            setUsers([]);
            setStores([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleUserSearch = () => loadData(`?qName=${userQuery}`, "");
    const handleStoreSearch = () => loadData("", `?qName=${storeQuery}`);

    const handleKeyPress = (e, type) => {
        if (e.key === 'Enter') {
            type === 'user' ? handleUserSearch() : handleStoreSearch();
        }
    };

    const StatCard = ({ label, value, icon: Icon, color = "blue" }) => (
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</div>
                    <div className="text-2xl font-bold text-gray-900">{value ?? "0"}</div>
                </div>
                <div className={`p-3 rounded-xl bg-${color}-50`}>
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    const MobileTableRow = ({ item, type }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
            {type === 'user' ? (
                <>
                    <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-gray-900 text-sm truncate flex-1">{item.name}</div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 ml-2 whitespace-nowrap">
                            {item.role}
                        </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1 truncate">{item.email}</div>
                    <div className="text-xs text-gray-500 truncate">{item.address}</div>
                </>
            ) : (
                <>
                    <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-gray-900 text-sm truncate flex-1">{item.name}</div>
                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 ml-2 whitespace-nowrap">
                            {item.avg_rating ?? "N/A"}
                        </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1 truncate">{item.email}</div>
                    <div className="text-xs text-gray-500 truncate">{item.address}</div>
                </>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 mt-10">
            <div className="bg-white shadow-sm border-b lg:hidden">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-xs text-gray-500 mt-0.5">Manage your platform</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm border-b hidden lg:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage users, stores and view statistics</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <span className="text-sm sm:text-base text-gray-600">Loading dashboard data...</span>
                    </div>
                ) : (
                    <>
                        <div className="lg:hidden bg-white rounded-xl shadow-sm p-1 mb-4">
                            <div className="flex space-x-1">
                                {["overview", "users", "stores"].map((section) => (
                                    <button
                                        key={section}
                                        onClick={() => setActiveSection(section)}
                                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-colors ${
                                            activeSection === section
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {section.charAt(0).toUpperCase() + section.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={`${activeSection !== 'overview' ? 'hidden lg:block' : ''}`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                                <StatCard label="Total Users" value={stats?.total_users} icon={FiUsers} color="blue" />
                                <StatCard label="Total Stores" value={stats?.total_stores} icon={FiShoppingBag} color="green" />
                                <StatCard label="Total Ratings" value={stats?.total_ratings} icon={FiStar} color="yellow" />
                            </div>
                        </div>

                        <div className={`${activeSection !== 'users' ? 'hidden lg:block' : ''}`}>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 sm:mb-8">
                                <div className="p-4 sm:p-6 border-b border-gray-200">
                                    <h2 className="font-bold text-gray-900 text-lg sm:text-xl mb-3 sm:mb-4">Users Management</h2>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                        <div className="flex-1 relative">
                                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                value={userQuery}
                                                onChange={(e) => setUserQuery(e.target.value)}
                                                onKeyPress={(e) => handleKeyPress(e, 'user')}
                                                placeholder="Search users by name..."
                                                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            />
                                        </div>
                                        <button 
                                            onClick={handleUserSearch} 
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-colors text-sm whitespace-nowrap shadow-sm"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>

                                <div className="lg:hidden">
                                    <div className="p-4">
                                        {users.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500 text-sm">
                                                No users found
                                            </div>
                                        ) : (
                                            users.map((user) => (
                                                <MobileTableRow key={user.id} item={user} type="user" />
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {users.map((u) => (
                                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{u.name}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-[200px]">{u.email}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-[200px]">{u.address || "N/A"}</td>
                                                    <td className="py-3 px-4">
                                                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {users.length === 0 && (
                                        <div className="text-center py-8 text-gray-500 text-sm">
                                            No users found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={`${activeSection !== 'stores' ? 'hidden lg:block' : ''}`}>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-4 sm:p-6 border-b border-gray-200">
                                    <h2 className="font-bold text-gray-900 text-lg sm:text-xl mb-3 sm:mb-4">Stores Management</h2>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                        <div className="flex-1 relative">
                                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                value={storeQuery}
                                                onChange={(e) => setStoreQuery(e.target.value)}
                                                onKeyPress={(e) => handleKeyPress(e, 'store')}
                                                placeholder="Search stores by name..."
                                                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            />
                                        </div>
                                        <button 
                                            onClick={handleStoreSearch} 
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-colors text-sm whitespace-nowrap shadow-sm"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>

                                <div className="lg:hidden">
                                    <div className="p-4">
                                        {stores.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500 text-sm">
                                                No stores found
                                            </div>
                                        ) : (
                                            stores.map((store) => (
                                                <MobileTableRow key={store.id} item={store} type="store" />
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {stores.map((s) => (
                                                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{s.name}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-[200px]">{s.email}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-[200px]">{s.address || "N/A"}</td>
                                                    <td className="py-3 px-4">
                                                        <span className="px-2.5 py-1 text-sm font-bold rounded-full bg-yellow-100 text-yellow-800">
                                                            {s.avg_rating ?? "N/A"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {stores.length === 0 && (
                                        <div className="text-center py-8 text-gray-500 text-sm">
                                            No stores found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}