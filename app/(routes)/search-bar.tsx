"use client";

import React, { useState } from "react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchProps {
  placeholder?: string;
}

export const SearchBar: React.FC<SearchProps> = ({ placeholder = "Search for products..." }) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Xử lý tìm kiếm khi bấm nút hoặc nhấn Enter
  const handleSearch = () => {
    if (query.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 w-96 shadow-sm">
      <SearchIcon className="text-gray-500 mr-2" />
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-gray-700"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition"
      >
        Search
      </button>
    </div>
  );
};
