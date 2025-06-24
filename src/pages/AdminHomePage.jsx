import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBoxOpen, FaChartLine } from 'react-icons/fa';

const AdminHomePage = () => {
  const orders = [
    {
      _id: 123123,
      user: {
        name: "John Doe",
      },
      totalPrice: 110,
      status: "Processing",
    },
    {
      _id: 123123,
      user: {
        name: "John Doe",
      },
      totalPrice: 110,
      status: "Processing",
    },
    {
      _id: 123123,
      user: {
        name: "John Doe",
      },
      totalPrice: 110,
      status: "Processing",
    },
  ];

   const [revenue, setRevenue] = useState(0);
const [orderCount, setOrderCount] = useState(0);
const [products, setProducts] = useState(0);


  // Animate numbers
 useEffect(() => {
  const animateValue = (target, setter, finalValue, duration = 1000) => {
    let start = 0;
    const increment = finalValue / (duration / 30);
    const interval = setInterval(() => {
      start += increment;
      if (start >= finalValue) {
        start = finalValue;
        clearInterval(interval);
      }
      setter(Math.floor(start));
    }, 30);
  };

  animateValue(0, setRevenue, 10000);
  animateValue(0, setOrderCount, 200);
  animateValue(0, setProducts, 100);
}, []);


  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Revenue */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
        <div className="flex items-center gap-4 mb-3">
          <FaChartLine className="text-3xl text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-600">Revenue</h2>
        </div>
        <p className="text-3xl font-bold text-blue-700">${revenue.toLocaleString()}</p>
      </div>

      {/* Orders */}
      <div className="p-6 bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
        <div className="flex items-center gap-4 mb-3">
          <FaShoppingCart className="text-3xl text-green-600" />
          <h2 className="text-lg font-semibold text-gray-600">Total Orders</h2>
        </div>
        <p className="text-3xl font-bold text-green-700">{orderCount}</p>

        <Link
          to="/admin/orders"
          className="mt-2 inline-block text-sm text-green-600 hover:underline font-medium"
        >
          Manage Orders →
        </Link>
      </div>

      {/* Products */}
      <div className="p-6 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
        <div className="flex items-center gap-4 mb-3">
          <FaBoxOpen className="text-3xl text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-600">Total Products</h2>
        </div>
        <p className="text-3xl font-bold text-purple-700">{products}</p>
        <Link
          to="/admin/products"
          className="mt-2 inline-block text-sm text-purple-600 hover:underline font-medium"
        >
          Manage Products →
        </Link>
      </div>
    </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                <tr>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Total Price</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="py-4 px-6 font-semibold text-gray-900 whitespace-nowrap">
                        #{order._id}
                      </td>
                      <td className="py-4 px-6">{order.user.name}</td>
                      <td className="py-4 px-6 font-semibold text-blue-600">
                        ₹{order.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 px-6 text-center text-gray-500 italic"
                    >
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
