import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import UserCard from "./UserCard";

const Search = ({authUser}) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchMutation = useMutation({
    mutationFn: async (query) => {

      const res = await axiosInstance.get(`/users/search?query=${encodeURIComponent(query)}`);
      console.log(res.data)
      return res.data;
    },
    onSuccess: (data) => setSearchResults(data),
    onError: (error) => {
      if (error.name !== "AbortError") {
        console.error("Search failed:", error.response?.data || error.message);
      }
    },
  });

  // Debounce search
  useEffect(() => {
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      searchMutation.mutate(query.trim());
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div className="mb-6 relative">
      <input
        type="text"
        placeholder="Search for users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded-lg bg-[#2a2a2a] text-gray-100 placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      )}

      {searchMutation.isLoading && (
        <div className="mt-4 p-4 bg-[#1e1e1e] rounded-lg border border-gray-700">
          <p className="text-gray-400">Searching...</p>
        </div>
      )}

      {searchMutation.isError && (
        <p className="text-red-400 mt-4">
          {searchMutation.error.response?.data?.message || "Search failed. Try again."}
        </p>
      )}

      {searchResults.length > 0 && (
        <div className="mt-6 bg-[#1e1e1e] p-4 rounded-lg border border-gray-700 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((user) => (
              <UserCard key={user._id} user={user} isConnection={authUser?.connections?.includes(user._id)} />
            ))}
          </div>
        </div>
      )}

      {!searchMutation.isLoading && query && searchResults.length === 0 && (
        <div className="mt-4 p-4 bg-[#1e1e1e] rounded-lg border border-gray-700">
          <p className="text-gray-400">No users found for <strong>"{query}"</strong>.</p>
        </div>
      )}
    </div>
  );
};

export default Search;