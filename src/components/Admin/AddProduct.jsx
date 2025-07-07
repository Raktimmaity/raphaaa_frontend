import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../redux/slices/adminProductSlice";
import { toast } from "sonner";


const AddProduct = () => {
  // const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    countInStock: "",
    sku: "",
    category: "",
    brand: "",
    sizes: "",
    colors: "",
    collections: "",
    material: "",
    gender: "",
    images: [{ url: "", altText: "" }],
    isFeatured: false,
    isPublished: false,
    tags: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    dimensions: {
      length: "",
      width: "",
      height: ""
    },
    weight: ""
  });
  const { loading, error } = useSelector(state => state.adminProducts);
  const dispatch = useDispatch();


  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setProductData({ ...productData, [name]: checked });
    } else if (name.startsWith("dimensions.")) {
      const dimensionKey = name.split(".")[1];
      setProductData({
        ...productData,
        dimensions: {
          ...productData.dimensions,
          [dimensionKey]: value
        }
      });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleImageChange = (index, field, value) => {
    const updatedImages = [...productData.images];
    updatedImages[index][field] = value;
    setProductData({ ...productData, images: updatedImages });
  };

  const addImageField = () => {
    setProductData({
      ...productData,
      images: [...productData.images, { url: "", altText: "" }]
    });
  };

  const removeImageField = (index) => {
    if (productData.images.length > 1) {
      const updatedImages = productData.images.filter((_, i) => i !== index);
      setProductData({ ...productData, images: updatedImages });
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      // setLoading(true);

      // Transform data to match backend schema
      const transformedData = {
        ...productData,
        price: Number(productData.price),
        discountPrice: productData.discountPrice ? Number(productData.discountPrice) : undefined,
        countInStock: Number(productData.countInStock),
        weight: productData.weight ? Number(productData.weight) : undefined,
        sizes: productData.sizes.split(",").map(size => size.trim()).filter(size => size),
        colors: productData.colors.split(",").map(color => color.trim()).filter(color => color),
        tags: productData.tags ? productData.tags.split(",").map(tag => tag.trim()).filter(tag => tag) : [],
        dimensions: {
          length: productData.dimensions.length ? Number(productData.dimensions.length) : undefined,
          width: productData.dimensions.width ? Number(productData.dimensions.width) : undefined,
          height: productData.dimensions.height ? Number(productData.dimensions.height) : undefined
        },
        images: productData.images.filter(img => img.url.trim() !== "")
      };

      // Remove empty dimensions object if all values are undefined
      if (!transformedData.dimensions.length && !transformedData.dimensions.width && !transformedData.dimensions.height) {
        delete transformedData.dimensions;
      }

      // Get token from localStorage
      const token = localStorage.getItem("userToken");
      
      // await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, transformedData, {
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${token}`
      //   },
      // });
      dispatch(createProduct(transformedData));


      // Reset form
      setProductData({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        countInStock: "",
        sku: "",
        category: "",
        brand: "",
        sizes: "",
        colors: "",
        collections: "",
        material: "",
        gender: "",
        images: [{ url: "", altText: "" }],
        isFeatured: false,
        isPublished: false,
        tags: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        dimensions: {
          length: "",
          width: "",
          height: ""
        },
        weight: ""
      });

      // alert("Product added successfully!");
      toast.success('Product added successfully!');
    } catch (err) {
      console.error("Error adding product:", err);
      // alert(`Failed to add product: ${err.response?.data?.message || err.message}`);
      toast.error('Failed to add product');
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mb-6">
      <h3 className="text-lg font-bold mb-6">Add New Product</h3>
      <p className="text-red-500 font-bold mb-3 animate-pulse"> * Note that product image you can upload after you can upload the product details. You can upload the product image by find using product name.</p>
      <form onSubmit={handleProductSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Product Name *</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleProductChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">SKU *</label>
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleProductChange}
              required
              placeholder="Unique product identifier"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Price *</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleProductChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Discount Price */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Discount Price</label>
            <input
              type="number"
              name="discountPrice"
              value={productData.discountPrice}
              onChange={handleProductChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Count in Stock */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Count in Stock *</label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleProductChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Category *</label>
            <select
              name="category"
              value={productData.category}
              onChange={handleProductChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Category</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Jeans">Jeans</option>
              <option value="Shirts">Shirts</option>
              <option value="Dresses">Dresses</option>
              <option value="Shoes">Shoes</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* Collections */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Collections *</label>
            <select
              name="collections"
              value={productData.collections}
              onChange={handleProductChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Collection</option>
              <option value="Summer">Summer</option>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
              <option value="Fall">Fall</option>
              <option value="New Arrivals">New Arrivals</option>
              <option value="Best Sellers">Best Sellers</option>
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Brand</label>
            <input
              type="text"
              name="brand"
              value={productData.brand}
              onChange={handleProductChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Gender</label>
            <select
              name="gender"
              value={productData.gender}
              onChange={handleProductChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Sizes * (comma-separated)</label>
            <input
              type="text"
              name="sizes"
              value={productData.sizes}
              onChange={handleProductChange}
              placeholder="e.g., S, M, L, XL"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Colors * (comma-separated)</label>
            <input
              type="text"
              name="colors"
              value={productData.colors}
              onChange={handleProductChange}
              placeholder="e.g., Red, Blue, Green"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Material */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Material</label>
            <input
              type="text"
              name="material"
              value={productData.material}
              onChange={handleProductChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={productData.weight}
              onChange={handleProductChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={productData.tags}
              onChange={handleProductChange}
              placeholder="e.g., trendy, casual, comfortable"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="block text-gray-700 mb-1 font-medium">Description *</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleProductChange}
            rows="4"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Images */}
        {/* <div className="mt-4">
          <label className="block text-gray-700 mb-1 font-medium">Product Images *</label>
          {productData.images.map((image, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                placeholder="Image URL"
                value={image.url}
                onChange={(e) => handleImageChange(index, "url", e.target.value)}
                required={index === 0}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Alt text"
                value={image.altText}
                onChange={(e) => handleImageChange(index, "altText", e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              />
              {productData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Another Image
          </button>
        </div> */}

        {/* Dimensions */}
        {/* <div className="mt-4">
          <label className="block text-gray-700 mb-1 font-medium">Dimensions (cm)</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              name="dimensions.length"
              placeholder="Length"
              value={productData.dimensions.length}
              onChange={handleProductChange}
              min="0"
              step="0.1"
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              name="dimensions.width"
              placeholder="Width"
              value={productData.dimensions.width}
              onChange={handleProductChange}
              min="0"
              step="0.1"
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              name="dimensions.height"
              placeholder="Height"
              value={productData.dimensions.height}
              onChange={handleProductChange}
              min="0"
              step="0.1"
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div> */}

        {/* SEO Fields */}
        {/* <div className="mt-4 grid grid-cols-1 gap-4">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={productData.metaTitle}
              onChange={handleProductChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Meta Description</label>
            <textarea
              name="metaDescription"
              value={productData.metaDescription}
              onChange={handleProductChange}
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Meta Keywords</label>
            <input
              type="text"
              name="metaKeywords"
              value={productData.metaKeywords}
              onChange={handleProductChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div> */}

        {/* Checkboxes */}
        {/* <div className="mt-4 flex gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={productData.isFeatured}
              onChange={handleProductChange}
              className="mr-2"
            />
            <label className="text-gray-700 font-medium">Featured Product</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPublished"
              checked={productData.isPublished}
              onChange={handleProductChange}
              className="mr-2"
            />
            <label className="text-gray-700 font-medium">Published</label>
          </div>
        </div> */}

        <div className="mt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;