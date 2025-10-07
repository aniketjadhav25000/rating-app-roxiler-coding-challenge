import React, { useEffect, useState } from "react";
import * as api from "../api";
import { Search, Star, Loader2 } from "lucide-react";

function Stars({ value }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const numericValue = parseInt(value) || 0;
  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <Star
          key={s}
          className={`w-5 h-5 transition-colors ${
            s <= numericValue ? "text-indigo-500 fill-indigo-500" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      <p className="mt-4 text-gray-600 font-medium">Loading stores...</p>
    </div>
  );
}

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const searchParams = new URLSearchParams();
  if (debouncedSearch) {
    searchParams.append("qName", debouncedSearch);
  }
  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getStores(query);
        setStores(res || []);
      } catch (error) {
        console.error("Failed to load stores:", error);
        setStores([]);
      } finally {
        setTimeout(() => setLoading(false), 200);
      }
    }
    load();
  }, [query, refresh]);

  const onRate = async (storeId, rating) => {
    await api.submitRating(storeId, rating);
    setRefresh((r) => r + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 lg:px-8 py-6 sm:py-3">
          
          <h1 className="hidden sm:block text-2xl font-semibold text-gray-800 tracking-tight">
            Store Ratings Dashboard
          </h1>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 sm:left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stores..."
              className="w-full border border-gray-300 rounded-xl py-3 sm:py-2.5 pl-10 sm:pl-11 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white text-base"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16"> 
        
        {loading && <LoadingSpinner />}

        {!loading && stores.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl p-5 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0 pr-3">
                    <h2 className="text-xl font-bold text-gray-800 truncate">{store.name}</h2>
                    <p className="text-sm text-gray-500">{store.address}</p>
                  </div>
                  <div className="text-center bg-indigo-50 p-2 rounded-lg shadow-inner w-20 flex-shrink-0">
                    <p className="text-xs text-indigo-700 font-medium">Avg.</p>
                    <p className="text-xl font-extrabold text-indigo-600 mt-0.5">
                      {store.overall_rating ?? "N/A"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ({store.total_ratings_count ?? 0} votes)
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                    Your Rating:
                    <span className={`text-base font-bold ${store.user_submitted_rating ? 'text-indigo-600' : 'text-red-500'}`}>
                      {store.user_submitted_rating || "Not Rated"}
                    </span>
                  </p>

                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        onClick={() => onRate(store.id, r)}
                        title={`Rate ${r} stars`}
                        className={`text-3xl transition-transform duration-150 p-1 rounded-md active:scale-95 ${
                          r <= store.user_submitted_rating
                            ? "text-yellow-500 scale-105"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 italic mt-1">
                    Tap a star to submit or change your rating.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && stores.length === 0 && !debouncedSearch && (
          <div className="text-center mt-20 p-8 border border-gray-200 rounded-xl bg-white shadow-inner">
            <p className="text-2xl font-bold text-gray-600">No stores found.</p>
            <p className="text-gray-500 mt-2">There might not be any stores created yet.</p>
          </div>
        )}
        {!loading && stores.length === 0 && debouncedSearch && (
          <div className="text-center mt-20 p-8 border border-gray-200 rounded-xl bg-white shadow-inner">
            <p className="text-2xl font-bold text-gray-600">No Match Found</p>
            <p className="text-gray-500 mt-2">Try a different search term or check spelling.</p>
          </div>
        )}
      </div>
    </div>
  );
}