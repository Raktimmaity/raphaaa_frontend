import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBoxOpen, FaUsers, FaRupeeSign } from "react-icons/fa";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";
import { fetchUsers } from "../redux/slices/adminSlice";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import axios from "axios";

const AdminHomePage = () => {
  const dispatch = useDispatch();

  const { orders } = useSelector((state) => state.adminOrders);
  const { users } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.adminProducts);

  const [revenue, setRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem("userToken"); // Get token from localStorage
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/revenue/total`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalRevenue(data.totalRevenue);
      } catch (err) {
        console.error("Error fetching revenue", err);
      }
    };

    if (user?.role === "merchantise" || user?.role === "admin") {
      fetchRevenue();
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchUsers());
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );
    setRevenue(totalRevenue);
    setOrderCount(orders.length);

    const trendMap = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      trendMap[date] = (trendMap[date] || 0) + 1;
    });
    const trendArray = Object.keys(trendMap).map((date) => ({
      date,
      orders: trendMap[date],
    }));
    setChartData(trendArray);
  }, [orders]);

  useEffect(() => {
    setUserCount(users.length);
  }, [users]);

  useEffect(() => {
    setProductCount(products.length);
  }, [products]);

  const useCountUp = (end, duration = 1000) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const increment = end / (duration / 16);
      const animate = () => {
        start += increment;
        if (start < end) {
          setCount(Math.floor(start));
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      animate();
    }, [end, duration]);
    return count;
  };

  const countOrders = useCountUp(orderCount);
  const countProducts = useCountUp(productCount);
  const countUsers = useCountUp(userCount);

  const pieData = [
    {
      name: "Processing",
      value: orders.filter((order) => order.status === "Processing").length,
    },
    {
      name: "Shipped",
      value: orders.filter((order) => order.status === "Shipped").length,
    },
    {
      name: "Delivered",
      value: orders.filter((order) => order.status === "Delivered").length,
    },
    {
      name: "Cancelled",
      value: orders.filter((order) => order.status === "Cancelled").length,
    },
  ];

  const COLORS = ["#facc15", "#38bdf8", "#22c55e", "#ef4444"];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {user.role === "admin"
          ? "Admin"
          : user.role === "merchantise"
            ? "Merchandise"
            : user.role === "marketing"
              ? "Marketing"
              : "Customer"}{" "}
        Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Orders (visible to both) */}
        <div className="p-6 rounded-2xl bg-white/70 shadow-xl backdrop-blur border border-green-100 hover:scale-[1.02] hover:shadow-2xl transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md">
              <FaShoppingCart className="text-xl" />
            </div>
            <div>
              <h2 className="text-md font-semibold text-gray-700">Total Orders</h2>
              <p className="text-3xl font-bold text-green-700">{countOrders}</p>
            </div>
          </div>
          <Link
            to={user?.role === "merchantise" ? "/admin/orders" : "/admin/orders"}
            className="text-sm text-green-600 hover:underline font-medium"
          >
            {user?.role === "merchantise" ? "View Sales →" : "Manage Orders →"}
          </Link>
        </div>

        {/* Products (visible to both) */}
        <div className="p-6 rounded-2xl bg-white/70 shadow-xl backdrop-blur border border-purple-100 hover:scale-[1.02] hover:shadow-2xl transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-md">
              <FaBoxOpen className="text-xl" />
            </div>
            <div>
              <h2 className="text-md font-semibold text-gray-700">Total Products</h2>
              <p className="text-3xl font-bold text-purple-700">{countProducts}</p>
            </div>
          </div>
          <Link
            to="/admin/products"
            className="text-sm text-purple-600 hover:underline font-medium"
          >
            Manage Products →
          </Link>
        </div>

        {/* Users (only for admin) */}
        {user?.role === "admin" && (
          <div className="p-6 rounded-2xl bg-white/70 shadow-xl backdrop-blur border border-yellow-100 hover:scale-[1.02] hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-md">
                <FaUsers className="text-xl" />
              </div>
              <div>
                <h2 className="text-md font-semibold text-gray-700">Total Users</h2>
                <p className="text-3xl font-bold text-yellow-700">{countUsers}</p>
              </div>
            </div>
            <Link
              to="/admin/users"
              className="text-sm text-yellow-600 hover:underline font-medium"
            >
              Manage Users →
            </Link>
          </div>
        )}

        {/* Revenue (visible to both) */}
        {(user?.role === "admin" || user?.role === "merchantise") && (
          <div className="p-6 rounded-2xl bg-white/70 shadow-xl backdrop-blur border border-blue-100 hover:scale-[1.02] hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md">
                <FaRupeeSign className="text-xl" />
              </div>
              <div>
                <h2 className="text-md font-semibold text-gray-700">Total Revenue</h2>
                <p className="text-3xl font-bold text-blue-700">₹{totalRevenue}</p>
              </div>
            </div>
            <Link
              to={user?.role === "merchantise" ? "/admin/orders" : "/admin/orders"}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              {user?.role === "merchantise" ? "View Sales →" : "Revenue Report →"}
            </Link>
          </div>
        )}

      </div>


      {/* Order Trend and Status Charts */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Order Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Order Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Order Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-10">
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
                {orders.slice(0, 5).map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="py-4 px-6 font-semibold text-gray-900 whitespace-nowrap">
                      #{order._id}
                    </td>
                    <td className="py-4 px-6">
                      {order.user?.name || "Unknown"}
                    </td>
                    <td className="py-4 px-6 font-semibold text-blue-600">
                      ₹{order.totalPrice?.toFixed(2) || 0}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
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

      {/* Recent User Signups */}
      {user?.role === "admin" && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Recent User Signups</h2>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="py-4 px-6">User Name</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .slice(-5)
                    .reverse()
                    .map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 transition-all duration-200"
                      >
                        <td className="py-4 px-6 font-semibold text-gray-900 whitespace-nowrap">
                          {user.name}
                        </td>
                        <td className="py-4 px-6">{user.email}</td>
                        <td className="py-4 px-6">
                          {new Date(user.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-6 px-6 text-center text-gray-500 italic"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomePage;
