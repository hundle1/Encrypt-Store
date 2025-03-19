"use client";

import React, { useState } from "react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const SearchBar = () => {
    const [query, setQuery] = useState("");
    const router = useRouter();

    // Xử lý tìm kiếm khi nhấn nút hoặc Enter
    const handleSearch = () => {
        if (query.trim() !== "") {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="flex items-center px-4 py-2 w-96 shadow-sm">
            <div className="flex items-center bg-white border border-gray-300 rounded-2xl px-3 h-10 shadow-sm w-96">
                <SearchIcon className="text-gray-500 mr-2 " />
                <input
                    className="w-full py-1 text-sm outline-none placeholder-gray-400 caret-black"
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Nhấn Enter để tìm kiếm
                />
            </div>
            <button
                onClick={handleSearch}
                className="ml-2 bg-white  px-4 py-2 rounded-2xl border border-[#1dc071] text-black hover:text-white hover:bg-blue-600 transition"
            >
                Search
            </button>
        </div>
    );
};
