import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const EditCollab = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collab, setCollab] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCollab = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/collabs/${id}`
        );
        setCollab(data);
      } catch {
        toast.error("Failed to fetch collab");
      }
    };

    const fetchProducts = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`
      );
      setAllProducts(data);
    };

    fetchCollab();
    fetchProducts();
  }, [id]);

  const handleChange = (field, value) => {
    setCollab({ ...collab, [field]: value });
  };

  const handleCollaboratorChange = (index, field, value) => {
    const updated = [...collab.collaborators];
    updated[index][field] = value;
    setCollab({ ...collab, collaborators: updated });
  };

  const handleProductToggle = (index, productId) => {
    const updated = [...collab.collaborators];
    const exists = updated[index].products.includes(productId);
    updated[index].products = exists
      ? updated[index].products.filter((id) => id !== productId)
      : [...updated[index].products, productId];
    setCollab({ ...collab, collaborators: updated });
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCollab({ ...collab, image: data.imageUrl });
      toast.success("Banner image uploaded");
    } catch {
      toast.error("Banner upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCollaboratorImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updated = [...collab.collaborators];
      updated[index].image = data.imageUrl;
      setCollab({ ...collab, collaborators: updated });

      toast.success(`Image uploaded for Footballer ${index + 1}`);
    } catch {
      toast.error("Footballer image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/collabs/${id}`,
        collab
      );
      toast.success("Collab updated successfully");
      navigate("/admin/collabs");
    } catch {
      toast.error("Failed to update collab");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteCollaborator = (index) => {
    const updated = [...collab.collaborators];
    updated.splice(index, 1); // remove the collaborator at the given index
    setCollab({ ...collab, collaborators: updated });
  };

  if (!collab) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Edit Collaboration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner Upload */}
        <div>
          <label className="font-medium text-gray-700 block mb-1">
            Collab Banner Image
          </label>
          <input type="file" accept="image/*" onChange={handleBannerUpload} />
          {collab.image && (
            <img
              src={collab.image}
              alt="Banner"
              className="h-28 mt-3 rounded object-cover border"
            />
          )}
        </div>

        <input
          type="text"
          value={collab.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2"
          placeholder="Collab Title"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={collab.isPublished}
            onChange={(e) => handleChange("isPublished", e.target.checked)}
          />
          <label className="text-sm text-gray-700">Publish</label>
        </div>

        {/* Collaborators */}
        {collab.collaborators.map((person, idx) => (
          <div
            key={idx}
            className="relative border p-8 rounded bg-gray-50 space-y-3"
          >
            <button
              onClick={() => handleDeleteCollaborator(idx)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-semibold text-3xl"
              title="Remove Footballer"
            >
              &times;
            </button>

            <input
              type="text"
              value={person.name}
              onChange={(e) =>
                handleCollaboratorChange(idx, "name", e.target.value)
              }
              placeholder="Footballer Name"
              className="w-full px-4 py-2 border rounded"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleCollaboratorImageUpload(e, idx)}
            />

            {person.image && (
              <img
                src={person.image}
                alt="footballer"
                className="h-24 mt-2 rounded border object-cover"
              />
            )}

            <p className="text-sm font-medium">Used Products:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded bg-white">
              {allProducts.map((product) => (
                <label key={product._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={person.products.some((p) =>
                      typeof p === "object"
                        ? p._id === product._id
                        : p === product._id
                    )}
                    onChange={() => handleProductToggle(idx, product._id)}
                  />
                  <span className="text-sm">{product.name}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="text-right pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-sky-500 text-white px-6 py-2.5 rounded hover:opacity-90"
          >
            {loading ? "Saving..." : "Update Collab"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCollab;
