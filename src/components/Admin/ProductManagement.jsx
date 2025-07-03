import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct, fetchAdminProducts } from "../../redux/slices/adminProductSlice";
import { FiEdit } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.adminProducts);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete your product?")) {
      dispatch(deleteProduct(id));
    }
  };

  // Filter by search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>

      {/* Search + Sort */}
      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="border px-4 py-2 rounded-md shadow-sm w-full md:max-w-xs bg-white outline-0"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm w-full md:w-auto bg-white outline-0"
        >
          <option value="">Sort by</option>
          <option value="name-asc">Name (A - Z)</option>
          <option value="name-desc">Name (Z - A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      <div className="bg-white p-6 shadow-md rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">SKU</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="py-3 px-6 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="py-3 px-6">₹{product.price}</td>
                    <td className="py-3 px-6">{product.sku}</td>
                    <td className="py-3 px-6 space-x-2">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="inline-block bg-yellow-500 text-white px-4 py-1.5 rounded hover:bg-yellow-600"
                      >
                       <FiEdit className="inline" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="inline-block bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600"
                      >
                       <FaTrash className="inline" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 px-6 text-center text-gray-500 italic">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-full ${
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
      </div>
    </div>
  );
};

export default ProductManagement;
