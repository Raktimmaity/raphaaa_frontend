import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { toast } from "sonner";

// Required chart.js registration
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const SalesTrendsPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    size: "",
    season: "",
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchSales = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/sales-analysis`
      );
      const data = await res.json();
      setSalesData(data);
      setFilteredProducts(data);
    } catch {
      toast.error("Failed to load sales data");
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    const filtered = salesData.filter((p) => {
      return (
        (!filters.category || p.category === filters.category) &&
        (!filters.gender || p.gender === filters.gender) &&
        (!filters.size || p.size === filters.size) &&
        (!filters.season || p.season === filters.season)
      );
    });
    setFilteredProducts(filtered);
  }, [filters, salesData]);

  // Chart data
  const salesChart = {
    labels: filteredProducts.map((p) => p.name),
    datasets: [
      {
        label: "Units Sold",
        data: filteredProducts.map((p) => p.totalSold),
        backgroundColor: "rgba(99, 102, 241, 0.7)",
      },
    ],
  };

  const trendChart = {
    labels: filteredProducts.map((p) => p.name),
    datasets: [
      {
        label: "Revenue",
        data: filteredProducts.map((p) => p.totalRevenue),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        fill: true,
      },
    ],
  };

  const seasonalStats = filteredProducts.reduce((acc, p) => {
    acc[p.season] = (acc[p.season] || 0) + p.totalSold;
    return acc;
  }, {});
  const seasonalChart = {
    labels: Object.keys(seasonalStats),
    datasets: [
      {
        label: "Sold by Season",
        data: Object.values(seasonalStats),
        backgroundColor: ["#10b981", "#ef4444", "#6366f1", "#f59e0b"],
      },
    ],
  };

  const handleFilterChange = (e) => {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Sales & Trend Analysis</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {["category", "gender", "size", "season"].map((f) => (
          <select
            key={f}
            name={f}
            value={filters[f]}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md shadow-sm bg-white"
          >
            <option value="">{`Filter by ${f}`}</option>
            {[...new Set(salesData.map((p) => p[f]))].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-6 mb-6">
        {filteredProducts.length > 0 && (
          <>
            <div className="bg-white p-4 rounded shadow-lg">
              <h3 className="text-lg font-semibold mb-2">
                Top Selling Products
              </h3>
              <Bar
                key={`bar-${filteredProducts.map((p) => p.productId).join(",")}`}
                data={salesChart}
                options={{ responsive: true }}
              />
            </div>

            <div className="bg-white p-4 rounded shadow-2xl">
              <h3 className="text-lg font-semibold mb-2">Revenue Trends</h3>
              <Line
                key={`line-${filteredProducts.map((p) => p.productId).join(",")}`}
                data={trendChart}
                options={{ responsive: true }}
              />
            </div>

            {/* <div className="bg-white p-4 rounded shadow border">
              <h3 className="text-lg font-semibold mb-2">
                Seasonal Demand Distribution
              </h3>
              <Pie
                key={`pie-${filteredProducts.map((p) => p.productId).join(",")}`}
                data={seasonalChart}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            </div> */}
          </>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white p-6 rounded shadow-2xl overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="py-3 px-6">Product</th>
              <th className="py-3 px-6">Category</th>
              <th className="py-3 px-6">Sold</th>
              <th className="py-3 px-6">Revenue</th>
              <th className="py-3 px-6">Season</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.productId} className="hover:bg-gray-50">
                <td className="py-3 px-6">{p.name}</td>
                <td className="py-3 px-6 capitalize">{p.category}</td>
                <td className="py-3 px-6">{p.totalSold}</td>
                <td className="py-3 px-6">₹{p.totalRevenue.toFixed(2)}</td>
                <td className="py-3 px-6 capitalize">{p.season || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTrendsPage;
