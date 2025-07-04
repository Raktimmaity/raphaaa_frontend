import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";

const MyOrders = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  const itemsPerPage = 5;

  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (error) return <p>Error: {error}</p>;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredOrders = orders
    .filter((order) => {
      if (statusFilter === "all") return true;
      return statusFilter === "paid" ? order.isPaid : !order.isPaid;
    })
    .filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        order._id.toLowerCase().includes(searchLower) ||
        order.orderItems[0].name.toLowerCase().includes(searchLower) ||
        order.shippingAddress.city.toLowerCase().includes(searchLower) ||
        order.shippingAddress.country.toLowerCase().includes(searchLower)
      );
    });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    return sortConfig.direction === "asc"
      ? new Date(aVal) > new Date(bVal) ? 1 : -1
      : new Date(aVal) < new Date(bVal) ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // Fix: Handle review navigation properly
  const handleWriteReview = (e, order) => {
    e.stopPropagation(); // Prevent row click

    // Get the first product from the order to review
    const firstProduct = order.orderItems[0];
    
    if (firstProduct && firstProduct.product) {
      // Navigate to review page with product ID
      navigate(`/review/${firstProduct.product}`);
    } else {
      // Fallback: use the order ID and handle it in the review component
      navigate(`/review-order/${order._id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">My Orders</h2>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
          <input
            type="text"
            placeholder="Search orders..."
            className="border px-3 py-2 rounded text-sm outline-0 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded text-sm outline-0 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="relative shadow-md sm:rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700 bg-white">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Order ID</th>
              <th
                className="py-3 px-4 cursor-pointer hover:underline"
                onClick={() => handleSort("createdAt")}
              >
                Ordered At
              </th>
              <th className="py-3 px-4">Shipping Address</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Delivery Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      className="w-12 h-12 object-cover rounded-md border"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(order.createdAt).toLocaleDateString()} <br />
                    <span className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.country}
                  </td>
                  <td className="py-3 px-4">{order.orderItems.length}</td>
                  <td className="py-3 px-4 font-semibold">
                    ₹{order.totalPrice}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`${
                        order.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      } px-3 py-1 rounded-full text-xs font-semibold`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`${
                        order.status === "Delivered"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "Shipped"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Cancelled"
                          ? "bg-red-200 text-red-800"
                          : "bg-gray-100 text-gray-700"
                      } px-3 py-1 rounded-full text-xs font-semibold`}
                    >
                      {order.status || "Processing"}
                    </span>

                    {/* Fixed Review Link */}
                    {order.status === "Delivered" && (
                      <div className="mt-2">
                        <button
                          onClick={(e) => handleWriteReview(e, order)}
                          className="text-sky-600 hover:text-sky-800 hover:underline text-xs font-medium bg-sky-50 px-2 py-1 rounded border border-sky-200 transition-colors"
                        >
                          Write Review
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-6 px-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end mt-6 gap-2 text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;