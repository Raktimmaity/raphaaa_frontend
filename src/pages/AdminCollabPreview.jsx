import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminCollabPreview = () => {
  const [collabs, setCollabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = localStorage.getItem("userInfo");

  const fetchCollabs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/collabs/all`
      );
      setCollabs(data);
    } catch (err) {
      toast.error("Failed to fetch collaborations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this collab?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/collabs/${id}`
      );
      toast.success("Collab deleted successfully!");
      fetchCollabs();
    } catch (err) {
      toast.error("Failed to delete collab");
    }
  };

  useEffect(() => {
    fetchCollabs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 mt-5">
      <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center tracking-tight">
        All Collaborations
      </h2>

      {loading ? (
        <p className="text-gray-600 text-center">Loading...</p>
      ) : collabs.length === 0 ? (
        <p className="text-gray-500 text-center">No collaborations available.</p>
      ) : (
        <div className="space-y-12">
          {collabs.map((collab) => (
            <div
              key={collab._id}
              className="border border-gray-200 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl transition hover:shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col md:flex-row gap-8 p-6">
                {/* Left Column */}
                <div className="w-full md:w-1/3 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {collab.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Description:{" "}
                    <span className="text-gray-700 font-medium">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit...
                    </span>
                  </p>

                  {collab.image && (
                    <img
                      src={collab.image}
                      alt={collab.title}
                      className="w-full h-52 object-cover mt-2 rounded-xl border"
                    />
                  )}

                  <span
                    className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${collab.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {collab.isPublished ? "Published" : "Draft"}
                  </span>
                  {JSON.parse(user || "{}")?.role === "merchantise" ? (
                    <div className="pt-4">
                      <span className="inline-block bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md font-semibold">
                        View Only
                      </span>
                    </div>
                  ) : (
                    <div className="pt-4 flex flex-col gap-3">
                      <Link
                        to={`/admin/edit-collab/${collab._id}`}
                        className="bg-sky-600 text-white text-sm px-4 py-2 rounded-md hover:bg-sky-700 transition-all text-center font-semibold"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(collab._id)}
                        className="bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600 transition-all font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {collab.collaborators.map((f, idx) => (
                    <div
                      key={`${f.name}-${idx}`}
                      className="bg-white border rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
                    >
                      <img
                        src={f.image}
                        alt={f.name}
                        className="w-full h-80 object-cover rounded-lg mb-3"
                      />
                      <h4 className="text-md font-bold text-gray-800">
                        {f.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 mb-2 font-semibold">
                        Products Featured:
                      </p>
                      <ul className="text-xs text-gray-700 space-y-2 overflow-y-auto max-h-36 pr-1">
                        {f.products.map((product) => (
                          <li
                            key={product._id}
                            className="flex items-center gap-2"
                          >
                            <img
                              src={product.images[0]?.url}
                              alt={product.name}
                              className="w-8 h-8 rounded object-cover border border-gray-300"
                            />
                            <Link
                              to={`/product/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
                              className="text-blue-600 hover:underline truncate"
                            >
                              {product.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCollabPreview;
