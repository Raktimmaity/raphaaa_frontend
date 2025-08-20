import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const AddEditOffer = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    offerPercentage: 0,
    startDate: "",
    endDate: "",
    bannerImage: "",
    alertImage: "",
    productIds: [],
  });
  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchProducts();
    if (id) fetchOffer();
  }, [id]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`
      );
      setProducts(data);
    } catch (err) {
      toast.error("Failed to fetch products");
    }
  };

  const fetchOffer = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/offers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      setFormData({
        title: data.title || "",
        description: data.description || "",
        offerPercentage: data.offerPercentage || 0,
        startDate: data.startDate?.slice(0, 10) || "",
        endDate: data.endDate?.slice(0, 10) || "",
        bannerImage: data.bannerImage || "",
        alertImage: data.alertImage || "",
        productIds: data.productIds?.map((p) => p._id) || [],
      });
    } catch (err) {
      toast.error("Failed to fetch offer");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imgData = new FormData();
    imgData.append("image", file);
    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        imgData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      setFormData((prev) => ({ ...prev, bannerImage: data.imageUrl }));
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      };

      if (id) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/offers/${id}`,
          formData,
          config
        );
        toast.success("Offer updated");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/offers`,
          formData,
          config
        );
        toast.success("Offer created");

        // ✅ Clear form after successful creation
        setFormData({
          title: "",
          description: "",
          offerPercentage: 0,
          startDate: "",
          endDate: "",
          bannerImage: "",
          alertImage: "",
          productIds: [],
        });

        // ✅ Reset file inputs manually
        document
          .querySelectorAll('input[type="file"]')
          .forEach((input) => (input.value = ""));
      }

    } catch (error) {
      console.error("Offer save error:", error);
      toast.error("Failed to save offer");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-gray-200">
        {/* Header */}
        <h2 className="text-3xl font-extrabold mb-8 text-slate-800 text-center tracking-wide">
          {id ? "Edit Offer" : "Add New Offer"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 transition outline-none"
            />
          </div>

          {/* Offer Percentage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Offer Percentage (%)
            </label>
            <input
              type="number"
              name="offerPercentage"
              value={formData.offerPercentage}
              onChange={handleChange}
              min={1}
              max={90}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 transition outline-none"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 transition outline-none"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 transition outline-none"
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 transition outline-none"
            ></textarea>
          </div>

          {/* Products */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Products
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-inner">
              {products.map((product) => (
                <label
                  key={product._id}
                  className="flex items-center gap-3 text-sm text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition outline-none"
                >
                  <input
                    type="checkbox"
                    value={product._id}
                    checked={formData.productIds.includes(product._id)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setFormData((prev) => ({
                        ...prev,
                        productIds: isChecked
                          ? [...prev.productIds, product._id]
                          : prev.productIds.filter((id) => id !== product._id),
                      }));
                    }}
                    className="accent-sky-500"
                  />
                  {product.name} - ₹{product.price}
                </label>
              ))}
            </div>
          </div>

          {/* Banner Image */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Banner Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
            {uploading && (
              <p className="text-sm text-sky-500 mt-2 animate-pulse">Uploading...</p>
            )}
            {formData.bannerImage && (
              <img
                src={formData.bannerImage}
                alt="Banner"
                className="mt-3 max-h-48 rounded-xl border shadow-md"
              />
            )}
          </div>

          {/* Alert Image */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alert Portrait Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const imgData = new FormData();
                imgData.append("image", file);
                try {
                  setUploading(true);
                  const { data } = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                    imgData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                      },
                    }
                  );
                  setFormData((prev) => ({ ...prev, alertImage: data.imageUrl }));
                } catch {
                  toast.error("Alert image upload failed");
                } finally {
                  setUploading(false);
                }
              }}
              className="w-full"
            />
            {uploading && (
              <p className="text-sm text-sky-500 mt-2 animate-pulse">Uploading...</p>
            )}
            {formData.alertImage && (
              <img
                src={formData.alertImage}
                alt="Alert"
                className="mt-3 max-h-64 rounded-xl border shadow-md mx-auto"
              />
            )}
          </div>

          {/* Submit */}
          <div className="col-span-2 text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-10 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
              disabled={uploading}
            >
              {id ? "Update Offer" : "Create Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditOffer;
