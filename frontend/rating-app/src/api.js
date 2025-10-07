
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
    return localStorage.getItem("token");
}

function authHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}


export async function register(user) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    return res.json();
}

export async function login(credentials) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    return res.json();
}

export async function changePassword(payload) {
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return res.json();
}


export async function getAdminDashboardStats() {
    const res = await fetch(`${BASE_URL}/admin/dashboard/stats`, { headers: authHeaders() });
    return res.json();
}

export async function getAdminUsers(query = "") {
    const res = await fetch(`${BASE_URL}/admin/users${query}`, { headers: authHeaders() });
    return res.json();
}

export async function getAdminStores(query = "") {
    const res = await fetch(`${BASE_URL}/admin/stores${query}`, { headers: authHeaders() });
    return res.json();
}

export async function adminCreateUser(data) {
    const res = await fetch(`${BASE_URL}/admin/users`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function adminCreateStore(data) {
    const res = await fetch(`${BASE_URL}/admin/stores`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
}


export async function getStores(query = "") {
    const res = await fetch(`${BASE_URL}/stores${query}`, { headers: authHeaders() });
    return res.json();
}

export async function submitRating(storeId, rating) {
    const res = await fetch(`${BASE_URL}/stores/${storeId}/rating`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ rating }),
    });
    return res.json();
}

export async function modifyRating(storeId, rating) {
    const res = await fetch(`${BASE_URL}/stores/${storeId}/rating`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ rating }),
    });
    return res.json();
}


export async function ownerCreateStore(data) { 
    const res = await fetch(`${BASE_URL}/owner/stores`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function getOwnedStores() {
    const res = await fetch(`${BASE_URL}/owner/stores`, { headers: authHeaders() });
    return res.json();
}

export async function getOwnerStoreRatings(storeId) {
    const res = await fetch(`${BASE_URL}/owner/stores/${storeId}/ratings`, { headers: authHeaders() });
    return res.json();
}

export async function getOwnerStoreSummary(storeId) {
    const res = await fetch(`${BASE_URL}/owner/stores/${storeId}/summary`, { headers: authHeaders() });
    return res.json();
}

export async function deleteStore(storeId) { 
    const res = await fetch(`${BASE_URL}/owner/stores/${storeId}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!res.ok) {
        let errorMessage = "Failed to delete store. Server returned an error.";
        try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
        } catch(e) {
        }
        throw new Error(errorMessage);
    }
    return true; 
}


export default {
    register,
    login,
    changePassword,
    getAdminDashboardStats,
    getAdminUsers,
    getAdminStores,
    adminCreateUser,
    adminCreateStore,
    getStores,
    submitRating,
    modifyRating,
    ownerCreateStore, 
    getOwnedStores,
    getOwnerStoreRatings,
    getOwnerStoreSummary,
    deleteStore, 
};