import React, { createContext, useState, useEffect, useContext } from "react";
import * as api from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
        const [user, setUser] = useState(() => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    useEffect(() => {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");
    }, [token]);

    const login = async (credentials) => {
        setLoading(true);
        const res = await api.login(credentials);
        setLoading(false);
        if (res.token) {
            setToken(res.token);
            setUser(res.user);
        }
        return res;
    };

    const register = async (payload) => {
        setLoading(true);
        const res = await api.register(payload);
        setLoading(false);
        if (res.token) {
            setToken(res.token);
            setUser(res.user);
        }
        return res;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);