import React, { useState } from "react";
import { addProduct } from "./api"; // ✅ Replace with your actual API helper
import { useSelector } from "react-redux";

const AddProductForm = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    countInStock: "",
    category: "",
    brand: "",
    sizes: "",
    colors: "",
    collections: "",
    material: "",
    gender: "",
    tags: "",
    dimensions: "",
    weight: "",
    sku: "",
    isFeatured: false,
    isPublished: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: Number(formData.discountPrice),
        countInStock: Number(formData.countInStock),
        sizes: formData.sizes.split(",").map((s) => s.trim()),
        colors: formData.colors.split(",").map((c) => c.trim()),
        tags: formData.tags.split(",").map((t) => t.trim()),
        weight: Number(formData.weight),
      };

      await addProduct(payload, userInfo.token);
      alert("Product added successfully!");

      setFormData({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        countInStock: "",
        category: "",
        brand: "",
        sizes: "",
        colors: "",
        collections: "",
        material: "",
        gender: "",
        tags: "",
        dimensions: "",
        weight: "",
        sku: "",
        isFeatured: false,
        isPublished: true,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mb-6">
      <h3 className="text-lg font-bold mb-6">Add New Product</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Description", name: "description", type: "text" },
            { label: "Price", name: "price", type: "number" },
            { label: "Discount Price", name: "discountPrice", type: "number" },
            { label: "Count in Stock", name: "countInStock", type: "number" },
            { label: "Category", name: "category", type: "text" },
            { label: "Brand", name: "brand", type: "text" },
            { label: "Sizes (comma separated)", name: "sizes", type: "text" },
            { label: "Colors (comma separated)", name: "colors", type: "text" },
            { label: "Collections", name: "collections", type: "text" },
            { label: "Material", name: "material", type: "text" },
            { label: "Gender", name: "gender", type: "text" },
            { label: "Tags (comma separated)", name: "tags", type: "text" },
            { label: "Dimensions", name: "dimensions", type: "text" },
            { label: "Weight", name: "weight", type: "number" },
            { label: "SKU", name: "sku", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-gray-700 mb-1 font-medium"
              >
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          ))}

          {/* isFeatured Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isFeatured" className="text-gray-700 font-medium">
              Featured Product
            </label>
          </div>

          {/* isPublished Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isPublished" className="text-gray-700 font-medium">
              Publish Product
            </label>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
