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
    alertImage: "", // 🆕
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
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/offers/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
    setFormData({
      title: data.title || "",
      description: data.description || "",
      offerPercentage: data.offerPercentage || 0,
      startDate: data.startDate?.slice(0, 10) || "",
      endDate: data.endDate?.slice(0, 10) || "",
      bannerImage: data.bannerImage || "",
      alertImage: data.alertImage || "",
      productIds: data.productIds?.map(p => p._id) || [],
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
    }

    // navigate("/admin/offers");
  } catch {
    toast.error("Failed to save offer");
  }
};


  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          {id ? "Edit Offer" : "Add New Offer"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            ></textarea>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Products
            </label>

            {/* Multi-select dropdown (retain for bulk select) */}
            <select
              multiple
              name="productIds"
              value={formData.productIds}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productIds: Array.from(
                    e.target.selectedOptions,
                    (opt) => opt.value
                  ),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 h-32 mb-3"
            >
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} - ₹{product.price}
                </option>
              ))}
            </select>

            {/* Optional: individual checkboxes for fine-grained control */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-gray-200 p-3 rounded-md shadow-inner bg-gray-50">
              {products.map((product) => (
                <label
                  key={product._id}
                  className="flex items-center gap-2 text-sm text-gray-700"
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
                  />
                  {product.name} - ₹{product.price}
                </label>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banner Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
            {uploading && (
              <p className="text-sm text-blue-500 mt-1">Uploading...</p>
            )}
            {formData.bannerImage && (
              <img
                src={formData.bannerImage}
                alt="Banner"
                className="mt-3 max-h-40 rounded-lg border"
              />
            )}
          </div>

          <div className="col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
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
  {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
  {formData.alertImage && (
    <img
      src={formData.alertImage}
      alt="Alert"
      className="mt-3 max-h-64 rounded-lg border mx-auto"
    />
  )}
</div>


          <div className="col-span-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-sm"
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
