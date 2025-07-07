import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/inventory`
        );
        const data = await res.json();
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        toast.error("Failed to load inventory");
      }
    };

    if (userInfo?.role === "admin" || userInfo?.role === "merchantise") {
      fetchInventory();
    }
  }, []);

  // Handle filter changes
  useEffect(() => {
    let data = [...products];

    if (categoryFilter !== "all") {
      data = data.filter(
        (item) => item.category?.toLowerCase() === categoryFilter
      );
    }

    data = data.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    setFiltered(data);
    setCurrentPage(1); // reset page on filter
  }, [categoryFilter, priceRange, products]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = [
    ...new Set(products.map((item) => item.category?.toLowerCase())),
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Inventory & Stock Tracking</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="font-medium">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-md outline-0 bg-white border"
          >
            <option value="all">All</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <label className="font-medium ml-4">Price:</label>
          <input
            type="number"
            className="w-20 border px-2 py-1 rounded bg-white outline-0"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
            placeholder="Min"
          />
          <span className="px-1">-</span>
          <input
            type="number"
            className="w-20 border px-2 py-1 rounded bg-white outline-0"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            placeholder="Max"
          />
        </div>
      </div>

      {products.length > 0 && (
        <div className="space-y-6 mb-6">
          {/* Bar Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">
              Stock Count per Product
            </h3>
            <Bar
              data={{
                labels: products.map((p) => p.name),
                datasets: [
                  {
                    label: "Stock Count",
                    data: products.map((p) => p.countInStock),
                    backgroundColor: "rgba(99, 102, 241, 0.7)",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                  },
                },
              }}
            />
          </div>

          {/* Pie Chart */}
          {/* <div className="bg-white p-4 rounded shadow border">
      <h3 className="text-lg font-semibold mb-2">Stock by Category</h3>
      <Pie
        data={{
          labels: [...new Set(products.map((p) => p.category))],
          datasets: [
            {
              label: "Stock by Category",
              data: [...new Set(products.map((p) => p.category))].map((cat) =>
                products
                  .filter((p) => p.category === cat)
                  .reduce((acc, curr) => acc + curr.countInStock, 0)
              ),
              backgroundColor: [
                "#6366f1",
                "#f59e0b",
                "#10b981",
                "#ef4444",
                "#8b5cf6",
                "#ec4899",
              ],
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#4b5563",
              },
            },
          },
        }}
      />
    </div> */}
        </div>
      )}

      <div className="overflow-x-auto rounded-md shadow-2xl">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Product
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((prod) => (
              <tr key={prod._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">{prod.name}</td>
                <td className="px-4 py-3 capitalize">{prod.category}</td>
                <td className="px-4 py-3">₹{prod.price}</td>
                <td className="px-4 py-3 font-medium">
                  <span
                    className={`${
                      prod.countInStock <= 5 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {prod.countInStock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${
                      prod.countInStock === 0
                        ? "bg-red-100 text-red-700"
                        : prod.countInStock <= 5
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {prod.countInStock === 0
                      ? "Out of Stock"
                      : prod.countInStock <= 5
                      ? "Low Stock"
                      : "In Stock"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded-full ${
              currentPage === idx + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-400 text-white hover:bg-gray-500"
            }`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
