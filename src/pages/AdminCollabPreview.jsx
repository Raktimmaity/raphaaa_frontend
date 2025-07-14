import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminCollabPreview = () => {
  const [collabs, setCollabs] = useState([]);
  const [loading, setLoading] = useState(false);

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
      fetchCollabs(); // Refresh
    } catch (err) {
      toast.error("Failed to delete collab");
    }
  };

  useEffect(() => {
    fetchCollabs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10 bg-white shadow-md rounded-xl border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        All Collaborations
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : collabs.length === 0 ? (
        <p className="text-gray-500">No collaborations available.</p>
      ) : (
        <div className="space-y-10">
          {collabs.map((collab) => (
            <div
              key={collab._id}
              className="border border-gray-200 rounded-xl shadow-sm bg-gray-50 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row gap-6 p-4">
                {/* Left Column */}
                <div className="w-full md:w-1/3 space-y-4">
                  {/* Title */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {collab.title}
                    </h3>

                    {/* Collab URL */}
                    <p className="text-xs text-gray-500 mt-1">
                      Description:{" "}
                      <span className="text-blue-600 break-words">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Culpa optio repudiandae est. Numquam in voluptatem
                        libero totam minima nisi illo. Officia quo consequatur
                        repellendus, repellat libero saepe molestias ad
                        voluptatem?
                      </span>
                    </p>

                    {/* Banner Image */}
                    {collab.image && (
                      <img
                        src={collab.image}
                        alt={collab.title}
                        className="w-full h-full object-cover mt-3 rounded-md border"
                      />
                    )}

                    {/* Status */}
                    <span
                      className={`text-xs inline-block mt-3 px-2 py-1 rounded-full font-medium ${
                        collab.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {collab.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex flex-col gap-3">
                    <Link
                      to={`/admin/edit-collab/${collab._id}`}
                      className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(collab._id)}
                      className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Right Column: Collaborators */}
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {collab.collaborators.map((f, idx) => (
                    <div
                      key={`${f.name}-${idx}`}
                      className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-all flex flex-col"
                    >
                      <img
                        src={f.image}
                        alt={f.name}
                        className="w-full h-auto max-h-40 object-cover rounded-md mb-3"
                      />
                      <h4 className="text-sm font-semibold text-gray-800">
                        {f.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 mb-2">
                        Used Products:
                      </p>
                      <ul className="text-xs text-gray-700 space-y-2 overflow-y-auto">
                        {f.products.map((product) => (
                          <li
                            key={product._id}
                            className="flex items-center space-x-3"
                          >
                            <img
                              src={product.images[0]?.url}
                              alt={product.name}
                              className="w-8 h-8 rounded object-cover border border-gray-300"
                            />
                            <Link
                              to={`/product/${product._id}`}
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
