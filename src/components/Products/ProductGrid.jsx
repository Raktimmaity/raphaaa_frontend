import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; // updated to 8

  // Pagination Logic
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin h-10 w-10 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!loading && products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-center">
        <img
          src="https://i.gifer.com/7VE.gif" // Replace this with any GIF URL you like
          alt="No products found"
          className="w-64 h-64 object-contain mb-4"
        />
        <p className="text-2xl font-semibold text-gray-600">
         🤧 Oops! No products found
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Try adjusting your filters and search again.
        </p>
      </div>
    );
  }

  return (
    <>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4">
    {currentProducts.map((product, index) => (
      <Link
        key={index}
        to={`/product/${product._id}`}
        className="block group transition-transform transform hover:-translate-y-1"
      >
        <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-sky-200">
          {/* ✅ Increased card height */}
          <div className="w-full h-[300px] mb-3 overflow-hidden rounded-lg">
            <img
              src={product.images[0].url}
              alt={product.images[0].altText || product.name}
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="px-0.5">
            <h3 className="text-base font-semibold text-blue-900 mb-1 truncate">
              {product.name}
            </h3>
            <p className="text-blue-700 font-bold text-sm tracking-wide">
              ₹ {product.price}
            </p>
          </div>
        </div>
      </Link>
    ))}
  </div>

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            currentPage === i + 1
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )}
</>

  );
};

export default ProductGrid;
