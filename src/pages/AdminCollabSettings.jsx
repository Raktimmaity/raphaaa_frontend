import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const AdminCollabSettings = () => {
  const [title, setTitle] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  // Handle Image Upload to Cloudinary
  const handleImageUpload = async (e) => {
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
            Authorization: `Bearer ${localStorage.getItem("userToken")}`, // ✅ pass auth token if required
          },
        }
      );

      setImage(data.imageUrl); // Save image URL returned from backend
      toast.success("Image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFootballerImageUpload = async (e, index) => {
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
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // Set the image URL to the collaborator's image field
      const updated = [...collaborators];
      updated[index].image = data.imageUrl;
      setCollaborators(updated);

      toast.success(`Footballer ${index + 1} image uploaded`);
    } catch (err) {
      console.error(err);
      toast.error("Footballer image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`
        );
        setAllProducts(data);
      } catch (err) {
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  const handleAddCollaborator = () => {
    setCollaborators([...collaborators, { name: "", image: "", products: [] }]);
  };

  const handleCollaboratorChange = (index, field, value) => {
    const updated = [...collaborators];
    updated[index][field] = value;
    setCollaborators(updated);
  };

  const handleProductToggle = (index, productId) => {
    const updated = [...collaborators];
    const exists = updated[index].products.includes(productId);
    updated[index].products = exists
      ? updated[index].products.filter((id) => id !== productId)
      : [...updated[index].products, productId];
    setCollaborators(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/collabs`, {
        title,
        image,
        isPublished,
        collaborators,
      });
      toast.success("Collab saved!");
      setTitle("");
      setIsPublished(false);
      setCollaborators([]);
    } catch (err) {
      toast.error("Failed to save collab");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10 border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Create Collaboration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Collab Banner Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Collab Banner Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm border border-gray-300 rounded-md p-2"
          />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          {image && (
            <img
              src={image}
              alt="Collab Banner"
              className="h-40 w-full object-cover rounded-md mt-2 shadow-sm"
            />
          )}
        </div>

        {/* Title & Publish */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Collab Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />
          </div>
          <div className="flex items-center space-x-2 mt-8 md:mt-6">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <label className="text-sm text-gray-700">Publish Now</label>
          </div>
        </div>

        {/* Collaborators */}
        <div className="space-y-6">
          {collaborators.map((collab, index) => (
            <div
              key={index}
              className="border border-gray-200 p-4 rounded-md bg-gray-50 shadow-sm"
            >
              <h4 className="font-semibold text-lg text-gray-800 mb-4">
                Footballer {index + 1}
              </h4>

              {/* Name + Image Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Footballer Name"
                  value={collab.name}
                  onChange={(e) =>
                    handleCollaboratorChange(index, "name", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-md text-sm"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFootballerImageUpload(e, index)}
                  className="text-sm"
                />
              </div>

              {/* Image Preview */}
              {collab.image && (
                <img
                  src={collab.image}
                  alt={`Footballer ${index + 1}`}
                  className="h-28 rounded-md object-cover mb-4 shadow"
                />
              )}

              {/* Product Selection */}
              <p className="text-sm font-medium mb-2">Select Used Products</p>

              {/* 🔍 Search Input */}
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />

              {/* ✅ Filtered Product List with Images */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-gray-200 p-3 bg-white rounded">
                {allProducts
                  .filter((product) =>
                    product.name
                      .toLowerCase()
                      .includes(productSearch.toLowerCase())
                  )
                  .map((product) => (
                    <label
                      key={product._id}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={collab.products.includes(product._id)}
                        onChange={() => handleProductToggle(index, product._id)}
                      />
                      <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <span className="truncate">{product.name}</span>
                    </label>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add Collaborator Button */}
        <div>
          <button
            type="button"
            onClick={handleAddCollaborator}
            className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700"
          >
            + Add Footballer
          </button>
        </div>

        {/* Submit */}
        <div className="text-right pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-sky-500 text-white px-6 py-3 rounded-md hover:opacity-90"
          >
            {loading ? "Saving..." : "Save Collab"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCollabSettings;
