"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import getProducts from "@/actions/get-products";
import { Product } from "@/types";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (query) {
        const result = await getProducts({ name: query }); // Gửi query đến API
        setProducts(result);
      }
    };
    fetchProducts();
  }, [query]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Result for : "{query}"</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.describe}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Không tìm thấy sản phẩm nào.</p>
      )}
    </div>
  );
};

export default SearchPage;
