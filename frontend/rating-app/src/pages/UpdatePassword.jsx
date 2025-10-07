import React, { useState } from "react";
import * as api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UpdatePassword() {
    const [oldPassword, setOld] = useState("");
    const [newPassword, setNew] = useState("");
    const [msg, setMsg] = useState(null);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        try {
            const res = await api.changePassword({ oldPassword, newPassword });
            if (res.message === "Password updated successfully") {
                setMsg({ type: "success", text: "Password updated successfully. Please log in again." });
               
                setTimeout(() => navigate("/login"), 1200);
            } else {
                setMsg({ type: "error", text: res.message || "Failed to update password" });
            }
        } catch (e) {
            setMsg({ type: "error", text: "Network error or unauthorized." });
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl mb-4">Update Password</h2>
            {msg && <div className={`${msg.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"} p-2 mb-2`}>{msg.text}</div>}
            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm">Old Password</label>
                    <input required value={oldPassword} onChange={e => setOld(e.target.value)} type="password" className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="block text-sm">New Password</label>
                    <input required value={newPassword} onChange={e => setNew(e.target.value)} type="password" className="w-full border p-2 rounded" />
                    <p className="text-xs text-gray-500 mt-1">8-16 chars, incl. 1 uppercase & 1 special char.</p>
                </div>
                <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded">Update</button>
            </form>
        </div>
    );
}