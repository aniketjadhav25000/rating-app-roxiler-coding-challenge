import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="p-6">Loading authentication status...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return <div className="p-6 text-red-600 font-semibold">403 Forbidden: You do not have access to this page.</div>;
    }
    
    return children;
}