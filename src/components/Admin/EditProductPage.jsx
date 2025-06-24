import React, { useState } from 'react'

const EditProductPage = () => {
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: [
            {
                url: "https://picsum.photos/150?random=1",
            },
            {
                url: "https://picsum.photos/150?random=2",
            },
        ],
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setProductData((prevData) => ({...prevData, [name]: value}));
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        console.log(file);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(productData);
        
    }

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
  <h2 className="text-3xl font-bold mb-8 text-gray-800">Edit Product</h2>
  <form onSubmit={handleSubmit} className="space-y-6">

  {/* Product Name */}
  <div>
    <label className="block font-semibold text-gray-700 mb-2">Product Name</label>
    <input
      type="text"
      name="name"
      value={productData.name}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
      required
    />
  </div>

  {/* Description */}
  <div>
    <label className="block font-semibold text-gray-700 mb-2">Description</label>
    <textarea
      name="description"
      onChange={handleChange}
      value={productData.description}
      rows={4}
      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
      required
    />
  </div>

  {/* Price, Stock, SKU in one line */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="block font-semibold text-gray-700 mb-2">Price</label>
      <input
        type="number"
        name="price"
        value={productData.price}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
      />
    </div>
    <div>
      <label className="block font-semibold text-gray-700 mb-2">Count in Stock</label>
      <input
        type="number"
        name="countInStock"
        value={productData.countInStock}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
      />
    </div>
    <div>
      <label className="block font-semibold text-gray-700 mb-2">SKU</label>
      <input
        type="number"
        name="sku"
        value={productData.sku}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
      />
    </div>
  </div>

  {/* Sizes and Colors in one line */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block font-semibold text-gray-700 mb-2">Sizes (comma-separated)</label>
      <input
        type="text"
        name="sizes"
        value={productData.sizes.join(", ")}
        onChange={(e) =>
          setProductData({
            ...productData,
            sizes: e.target.value.split(",").map((size) => size.trim()),
          })
        }
        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
      />
    </div>
    <div>
      <label className="block font-semibold text-gray-700 mb-2">Colors (comma-separated)</label>
      <input
        type="text"
        name="colors"
        value={productData.colors.join(", ")}
        onChange={(e) =>
          setProductData({
            ...productData,
            colors: e.target.value.split(",").map((color) => color.trim()),
          })
        }
        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
      />
    </div>
  </div>

  {/* Image Upload */}
  <div>
    <label className="block font-semibold text-gray-700 mb-2">Upload Image</label>
    <input
      type="file"
      onChange={handleImageUpload}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
    />
    <div className="flex gap-4 mt-4 flex-wrap">
      {productData.images.map((image, index) => (
        <div key={index} className="w-20 h-20">
          <img
            src={image.url}
            alt={image.altText || "Product"}
            className="w-full h-full object-cover rounded-md shadow"
          />
        </div>
      ))}
    </div>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-medium transition-colors duration-200"
  >
    Update Product
  </button>
</form>

</div>

  )
}

export default EditProductPage
