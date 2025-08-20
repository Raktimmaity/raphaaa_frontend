import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRupeeSign, FaCalendarAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { FaRupeeSign } from "react-icons/fa";

const RevenueReport = () => {
  const { userInfo: user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [period, setPeriod] = useState("monthly");
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("userToken");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // if (!user || (user.role !== "admin" && user.role !== "merchantise")) {
    //   navigate("/unauthorized");
    //   return;
    // }

    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${backendUrl}/api/orders/revenue/${period}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Revenue data fetched:", data);
        setRevenueData(data);
      } catch (error) {
        console.error("Fetch error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [period, user, navigate]);

  return (
  <div className="p-6 max-w-6xl mx-auto">
    {/* Header */}
    <div className="mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-amber-500 bg-clip-text text-transparent">
            Revenue Report
          </span>{" "}
          <span className="text-gray-500 text-xl font-semibold">
            ({period.charAt(0).toUpperCase() + period.slice(1)})
          </span>
        </h1>

        {/* Period segmented control */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          {["daily", "weekly", "monthly", "yearly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${period === p
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Loading */}
    {loading ? (
      <div className="mt-4 space-y-6">
        {/* KPI skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/70 shadow-xl backdrop-blur border border-gray-100 animate-pulse"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="space-y-2 w-40">
                  <div className="h-3 bg-gray-200 rounded w-24" />
                  <div className="h-5 bg-gray-200 rounded w-32" />
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
        {/* Table skeleton */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="h-10 bg-gray-100 rounded-t-2xl" />
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    ) : revenueData ? (
      <>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Total Revenue */}
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-blue-100 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md">
                <FaRupeeSign className="text-xl" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-600">Total Revenue</h2>
                <p className="text-3xl font-extrabold text-blue-700">
                  ₹{Number(revenueData.totalRevenue).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 rounded" />
          </div>

          {/* Total Orders */}
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-green-100 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md">
                <FaCalendarAlt className="text-xl" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-600">Total Orders</h2>
                <p className="text-3xl font-extrabold text-green-700">
                  {Number(revenueData.totalOrders).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400 rounded" />
          </div>
        </div>

        {/* Products Sold List */}
        {revenueData.productsSold && revenueData.productsSold.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-semibold text-gray-900">Products Sold</h2>
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                {revenueData.productsSold.length} items
              </span>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition">
              <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-500" />
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-left text-sm text-gray-700">
                  <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur text-xs uppercase text-gray-600 border-b">
                    <tr>
                      <th className="px-6 py-3.5 font-semibold tracking-wide">Product</th>
                      <th className="px-6 py-3.5 font-semibold tracking-wide">Category</th>
                      <th className="px-6 py-3.5 font-semibold tracking-wide text-right">Quantity</th>
                      <th className="px-6 py-3.5 font-semibold tracking-wide text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {revenueData.productsSold.map((product, index) => (
                      <tr
                        key={index}
                        className="hover:bg-indigo-50/40 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums">
                          {Number(product.totalSold).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}

                    {/* Optional totals row if you track totals here */}
                    {/* <tr className="bg-gray-50 font-semibold text-gray-900">
                      <td className="px-6 py-3.5" colSpan={2}>Total</td>
                      <td className="px-6 py-3.5 text-right tabular-nums">
                        {revenueData.productsSold.reduce((s, x) => s + x.totalSold, 0)}
                      </td>
                      <td className="px-6 py-3.5 text-right tabular-nums">
                        ₹{revenueData.productsSold.reduce((s, x) => s + x.price, 0).toLocaleString("en-IN")}
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </>
    ) : (
      <p className="text-red-500">No data found for selected period.</p>
    )}
  </div>
);
};

export default RevenueReport;
