// api.js

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
    return localStorage.getItem("token");
}

function authHeaders() {
    const token = getToken();
    return token 
        ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } 
        : { "Content-Type": "application/json" };
}

async function handleResponse(res) {
    if (!res.ok) {
        let errorMessage = `API call failed with status: ${res.status}`;
        try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
        } catch(e) {}
        throw new Error(errorMessage);
    }
    const contentType = res.headers.get("content-type");
    if (res.status === 204 || (contentType && !contentType.includes("application/json"))) {
        return null;
    }
    return res.json();
}

// --- ADMIN DELETE FUNCTIONS (CORRECTED URLS) ---

/**
 * Deletes a user by their ID, using the correct plural path: /admin/users/:userId
 */
export async function adminDeleteUser(userId) {
    // URL MATCHES: DELETE /api/admin/users/:id
    const res = await fetch(`${BASE_URL}/admin/users/${userId}`, { 
        method: "DELETE",
        headers: authHeaders(),
    });
    return handleResponse(res); 
}

/**
 * Deletes a store by its ID, using the correct plural path: /admin/stores/:storeId
 */
export async function adminDeleteStore(storeId) {
    // URL MATCHES: DELETE /api/admin/stores/:id
    const res = await fetch(`${BASE_URL}/admin/stores/${storeId}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return handleResponse(res);
}

// --- ALL OTHER FUNCTIONS (PRESERVED) ---

export async function register(user) {
    const res = await fetch(`${BASE_URL}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(user) });
    return handleResponse(res);
}

export async function login(credentials) {
    const res = await fetch(`${BASE_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials) });
    return handleResponse(res);
}

export async function changePassword(payload) {
    const res = await fetch(`${BASE_URL}/auth/change-password`, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
    return handleResponse(res);
}

export async function getAdminDashboardStats() {
    // URL MATCHES: GET /api/admin/dashboard/stats
    const res = await fetch(`${BASE_URL}/admin/dashboard/stats`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function getAdminUsers(query = "") {
    // URL MATCHES: GET /api/admin/users
    const res = await fetch(`${BASE_URL}/admin/users${query}`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function getAdminStores(query = "") {
    // URL MATCHES: GET /api/admin/stores
    const res = await fetch(`${BASE_URL}/admin/stores${query}`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function adminCreateUser(data) {
    // URL MATCHES: POST /api/admin/users
    const res = await fetch(`${BASE_URL}/admin/users`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
}

export async function adminCreateStore(data) {
    // URL MATCHES: POST /api/admin/stores
    const res = await fetch(`${BASE_URL}/admin/stores`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
}

export async function getStores(query = "") {
    const res = await fetch(`${BASE_URL}/stores${query}`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function submitRating(storeId, rating) {
    const res = await fetch(`${BASE_URL}/stores/${storeId}/rating`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ rating }) });
    return handleResponse(res);
}

export async function modifyRating(storeId, rating) {
    const res = await fetch(`${BASE_URL}/stores/${storeId}/rating`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ rating }) });
    return handleResponse(res);
}

export async function ownerCreateStore(data) { 
    const res = await fetch(`${BASE_URL}/owner/stores`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
}

export async function getOwnedStores() {
    const res = await fetch(`${BASE_URL}/owner/stores`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function getOwnerStoreRatings(storeId) {
    const res = await fetch(`${BASE_URL}/owner/stores/${storeId}/ratings`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function getOwnerStoreSummary(storeId) {
    const res = await fetch(`${BASE_URL}/owner/stores/${storeId}/summary`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function deleteStore(storeId) { 
    // URL MATCHES: DELETE /api/owner/stores/:storeId
    const res = await fetch(`${BASE_URL}/owner/stores/${storeId}`, { method: "DELETE", headers: authHeaders() });
    const result = await handleResponse(res);
    return result === null ? true : result; 
}

export default {
    register, login, changePassword, getAdminDashboardStats, getAdminUsers, getAdminStores,
    adminCreateUser, adminCreateStore, adminDeleteUser, adminDeleteStore, getStores,
    submitRating, modifyRating, ownerCreateStore, getOwnedStores, getOwnerStoreRatings,
    getOwnerStoreSummary, deleteStore,
};