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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Revenue Report ({period.charAt(0).toUpperCase() + period.slice(1)})
      </h1>

      <div className="flex flex-wrap gap-4 mb-6">
        {["daily", "weekly", "monthly", "yearly"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg shadow-md font-medium transition ${
              period === p
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-600 mt-4">Loading revenue data...</p>
      ) : revenueData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Total Revenue */}
          <div className="p-6 rounded-2xl bg-white/70 shadow-xl backdrop-blur border border-blue-100 hover:scale-[1.02] hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md">
                <FaRupeeSign className="text-xl" />
              </div>
              <div>
                <h2 className="text-md font-semibold text-gray-700">
                  Total Revenue
                </h2>
                <p className="text-3xl font-bold text-blue-700">
                  ₹{revenueData.totalRevenue}
                </p>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="p-6 rounded-2xl bg-white/70 shadow-xl backdrop-blur border border-green-100 hover:scale-[1.02] hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md">
                <FaCalendarAlt className="text-xl" />
              </div>
              <div>
                <h2 className="text-md font-semibold text-gray-700">
                  Total Orders
                </h2>
                <p className="text-3xl font-bold text-green-700">
                  {revenueData.totalOrders}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-red-500">No data found for selected period.</p>
      )}
    </div>
  );
};

export default RevenueReport;
