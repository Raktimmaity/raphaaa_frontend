import React from "react";
import { Link } from "react-router-dom";

const ProductManagement = () => {
  const products = [
    {
      _id: 123123,
      name: "Shirt",
      price: 110,
      sku: "123123213",
    },
  ];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete your product?")) {
      console.log("Delete product: ", id);
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>

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
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="py-3 px-6 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="py-3 px-6">${product.price}</td>
                    <td className="py-3 px-6">{product.sku}</td>
                    <td className="py-3 px-6 space-x-2">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="inline-block bg-yellow-500 text-white px-4 py-1.5 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="inline-block bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 px-6 text-center text-gray-500 italic"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
