import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import * as api from "../api";

function Stars({ value }) {
  const count = Math.round(parseFloat(value) || 0);
  return (
    <div className="flex items-center text-xs sm:text-sm">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`${i <= count ? "text-yellow-500" : "text-gray-300"} text-sm sm:text-base`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center py-8 sm:py-12 space-y-3 sm:space-y-0">
      <svg
        className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
        <path
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          fill="currentColor"
          className="opacity-75"
        />
      </svg>
      <span className="text-sm sm:text-lg text-gray-600 sm:ml-3">Loading dashboard...</span>
    </div>
  );
}

function StoreCard({ store, summary, ratings, onDelete, isExpanded, onToggleExpand }) {
  const total = summary?.total ?? 0;
  const avg = summary?.avg_rating ?? "0.00";
  const limit = 2;
  const visibleRatings = isExpanded ? ratings : ratings.slice(0, limit);

  return (
    <div className="bg-white rounded-xl shadow-lg border-l-4 sm:border-l-8 border-blue-600 hover:shadow-xl transition-all duration-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 break-words leading-tight">
              {store.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 flex items-start mt-1">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="break-words line-clamp-2">{store.address}</span>
            </p>
          </div>

          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => onDelete(store.id, store.name)}
              className="flex items-center justify-center bg-red-50 text-red-700 hover:bg-red-100 font-medium py-2 px-3 rounded-lg transition-colors text-xs sm:text-sm order-2 xs:order-1"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 min-w-[120px] sm:min-w-[140px] order-1 xs:order-2">
              <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Overall Rating</div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-700 leading-none">{avg}</div>
              <Stars value={avg} />
              <div className="text-xs text-gray-500 mt-1">from {total} votes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Recent Ratings ({ratings.length})</h3>
          {ratings.length > 0 && (
            <button
              onClick={onToggleExpand}
              className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm transition-colors"
            >
              {isExpanded ? "Show Less" : "Show All"}
            </button>
          )}
        </div>

        {ratings.length ? (
          <div className="space-y-2">
            {visibleRatings.map((r, i) => (
              <div
                key={`${store.id}-${r.email}-${i}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center min-w-0 flex-1">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0">
                    {r.name ? r.name[0].toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-800 text-sm truncate">{r.name || "Anonymous User"}</div>
                    <div className="text-xs text-gray-500 truncate">{r.email}</div>
                  </div>
                </div>
                <div className="flex items-center text-lg sm:text-xl font-bold text-yellow-500 ml-3">
                  {r.rating}
                  <span className="ml-1">★</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm border border-dashed rounded-lg">No ratings yet</div>
        )}
      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isError, setIsError] = useState(false);
  const [expanded, setExpanded] = useState({});
  const location = useLocation();

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const owned = await api.getOwnedStores();
      const data = [];

      for (const store of owned || []) {
        const summary = await api.getOwnerStoreSummary(store.id);
        const ratings = await api.getOwnerStoreRatings(store.id);
        data.push({ store, summary, ratings });
      }

      setStores(data);
    } catch (e) {
      console.error(e);
      setStores([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let timer;
    fetchStores();

    if (location.state?.storeCreated) {
      setToast(`Store "${location.state.storeName}" successfully registered!`);
      setIsError(false);
      window.history.replaceState({}, document.title, window.location.pathname);
      timer = setTimeout(() => setToast(null), 4000);
    }

    return () => timer && clearTimeout(timer);
  }, [fetchStores, location.state?.storeCreated]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.deleteStore(id);
      setToast(`Store "${name}" has been successfully deleted.`);
      setIsError(false);
      fetchStores();
    } catch (e) {
      setToast(`Error deleting store "${name}". Details: ${e.message || "Check console."}`);
      setIsError(true);
    }
    setTimeout(() => setToast(null), 4000);
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className="fixed top-4 left-4 right-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:max-w-md z-50 animate-fadeInOut">
          <div className={`px-4 py-3 rounded-xl shadow-lg flex items-start gap-3 ${isError ? "bg-red-600" : "bg-green-600"}`}>
            <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={isError ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7"} />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">{isError ? "Operation Failed" : "Success"}</p>
              <p className="text-xs text-white opacity-90 break-words mt-0.5">{toast}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Store Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage your stores and view ratings</p>
          </div>
          <Link
            to="/owner/create-store"
            className="inline-flex items-center justify-center bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Store
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {loading && <LoadingSpinner />}

        {!loading && stores.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {stores.map(({ store, summary, ratings }) => (
              <StoreCard
                key={store.id}
                store={store}
                summary={summary}
                ratings={ratings}
                onDelete={handleDelete}
                isExpanded={expanded[store.id]}
                onToggleExpand={() => toggleExpand(store.id)}
              />
            ))}
          </div>
        )}

        {!loading && stores.length === 0 && (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm border border-dashed">
            <div className="max-w-md mx-auto px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Stores Found</h3>
              <p className="text-gray-500 text-sm mb-6">Get started by registering your first store</p>
              <Link
                to="/owner/create-store"
                className="inline-flex items-center justify-center bg-green-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-green-700 transition-colors text-sm w-full sm:w-auto"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
                Register First Store
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
