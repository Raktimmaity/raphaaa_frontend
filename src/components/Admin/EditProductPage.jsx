// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   fetchProductDetails,
//   updateProduct,
// } from "../../redux/slices/productsSlice";
// import axios from "axios";

// const EditProductPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { selectedProduct, loading, error } = useSelector(
//     (state) => state.products
//   );
//   const [productData, setProductData] = useState({
//     name: "",
//     description: "",
//     price: 0,
//     countInStock: 0,
//     sku: "",
//     category: "",
//     brand: "",
//     sizes: [],
//     colors: [],
//     collections: "",
//     material: "",
//     gender: "",
//     images: [],
//   });

//   const [uploading, setUploading] = useState(false); //Image uploading state

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchProductDetails(id));
//     }
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (selectedProduct) {
//       setProductData(selectedProduct);
//     }
//   }, [selectedProduct]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProductData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     // console.log(file);
//     const formData = new FormData();
//     formData.append("image", file);
//     try {
//       setUploading(true);
//       const { data } = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
//         formData,
//         {
//           header: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setProductData((prevData) => ({
//         ...prevData,
//         images: [...prevData.images, { url: data.imageUrl, altText: "" }],
//       }));
//       setUploading(false);
//     } catch (error) {
//       console.error(error);
//       setUploading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // console.log(productData);
//     dispatch(updateProduct({ id, productData }));
//     navigate("/admin/products");
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p> Error: {error} </p>;

//   return (
//     <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
//       <h2 className="text-3xl font-bold mb-8 text-gray-800">Edit Product</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Product Name */}
//         <div>
//           <label className="block font-semibold text-gray-700 mb-2">
//             Product Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={productData.name}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
//             required
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block font-semibold text-gray-700 mb-2">
//             Description
//           </label>
//           <textarea
//             name="description"
//             onChange={handleChange}
//             value={productData.description}
//             rows={4}
//             className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
//             required
//           />
//         </div>

//         {/* Price, Stock, SKU in one line */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block font-semibold text-gray-700 mb-2">
//               Price
//             </label>
//             <input
//               type="number"
//               name="price"
//               value={productData.price}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
//             />
//           </div>
//           <div>
//             <label className="block font-semibold text-gray-700 mb-2">
//               Count in Stock
//             </label>
//             <input
//               type="number"
//               name="countInStock"
//               value={productData.countInStock}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
//             />
//           </div>
//           <div>
//             <label className="block font-semibold text-gray-700 mb-2">
//               SKU
//             </label>
//             <input
//               type="text"
//               name="sku"
//               value={productData.sku}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
//             />
//           </div>
//         </div>

//         {/* Sizes and Colors in one line */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block font-semibold text-gray-700 mb-2">
//               Sizes (comma-separated)
//             </label>
//             <input
//               type="text"
//               name="sizes"
//               value={productData.sizes.join(", ")}
//               onChange={(e) =>
//                 setProductData({
//                   ...productData,
//                   sizes: e.target.value.split(",").map((size) => size.trim()),
//                 })
//               }
//               className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
//             />
//           </div>
//           <div>
//             <label className="block font-semibold text-gray-700 mb-2">
//               Colors (comma-separated)
//             </label>
//             <input
//               type="text"
//               name="colors"
//               value={productData.colors.join(", ")}
//               onChange={(e) =>
//                 setProductData({
//                   ...productData,
//                   colors: e.target.value
//                     .split(",")
//                     .map((color) => color.trim()),
//                 })
//               }
//               className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
//             />
//           </div>
//         </div>

//         {/* Image Upload */}
//         <div>
//           <label className="block font-semibold text-gray-700 mb-2">
//             Upload Image
//           </label>
//           <input
//             type="file"
//             onChange={handleImageUpload}
//             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
//           />
//           {uploading && <p>Uploading Image....</p> }
//           <div className="flex gap-4 mt-4 flex-wrap">
//             {productData.images.map((image, index) => (
//               <div key={index} className="w-20 h-20">
//                 <img
//                   src={image.url}
//                   alt={image.altText || "Product"}
//                   className="w-full h-full object-cover rounded-md shadow"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-medium transition-colors duration-200"
//         >
//           Update Product
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProductPage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import {
  fetchProductDetails,
  updateProduct,
} from "../../redux/slices/productsSlice";
import axios from "axios";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );
  const { token } = useSelector((state) => state.auth);

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
    images: [],
    offerPercentage: 0,
    discountPrice: 0,
  });

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
  const { name, value } = e.target;
  let updatedData = { ...productData };

  // Handle nested dimension fields
  if (name.startsWith("dimensions.")) {
    const key = name.split(".")[1];
    updatedData.dimensions = {
      ...updatedData.dimensions,
      [key]: value,
    };
  } else {
    updatedData[name] = value;

    // Offer calculation logic
    if (name === "offerPercentage" || name === "price") {
      const price = parseFloat(
        name === "price" ? value : updatedData.price
      );
      const offer = parseFloat(
        name === "offerPercentage" ? value : updatedData.offerPercentage
      );

      if (!isNaN(price) && !isNaN(offer)) {
        const discount = price - (price * offer) / 100;
        updatedData.discountPrice = Math.round(discount);
      }
    }
  }

  setProductData(updatedData);
};


  const handleMultiSelect = (selectedOptions, name) => {
    const values = selectedOptions.map((opt) => opt.value);
    setProductData({ ...productData, [name]: values });
  };

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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProductData((prevData) => ({
        ...prevData,
        images: [
          ...prevData.images,
          { url: data.imageUrl, altText: "", publicId: data.publicId },
        ],
      }));
      setUploading(false);
      e.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleImageRemove = async (index, imageUrl) => {
    try {
      setDeleting(index);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload/delete`,
        { imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: prevData.images.filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error("Delete error:", error);
      setProductData((prevData) => ({
        ...prevData,
        images: prevData.images.filter((_, i) => i !== index),
      }));
    } finally {
      setDeleting(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md p-3"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Count in stock
            </label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Offer Percentage
            </label>
            <input
              type="number"
              name="offerPercentage"
              value={productData.offerPercentage || 0}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              placeholder="e.g. 20"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Discount Price
            </label>
            <input
              type="number"
              name="discountPrice"
              value={productData.discountPrice || 0}
              readOnly
              className="w-full border border-gray-300 rounded-md p-3 bg-gray-100"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Length
            </label>
            <input
              type="number"
              name="dimensions.length"
              placeholder="Length"
              value={productData.dimensions?.length || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Dimensions
            </label>
            <input
              type="number"
              name="dimensions.width"
              placeholder="Width"
              value={productData.dimensions?.width || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Height
            </label>
            <input
              type="number"
              name="dimensions.height"
              placeholder="Height"
              value={productData.dimensions?.height || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Weight
            </label>
            <input
              type="number"
              name="weight"
              placeholder="Weight"
              value={productData.weight || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        {/* Dimensions & Weight */}
        {/* <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Dimensions (cm) & Weight (kg)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input
              type="number"
              name="dimensions.length"
              placeholder="Length"
              value={productData.dimensions?.length || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              min="0"
              step="0.1"
            />
            <input
              type="number"
              name="dimensions.width"
              placeholder="Width"
              value={productData.dimensions?.width || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              min="0"
              step="0.1"
            />
            <input
              type="number"
              name="dimensions.height"
              placeholder="Height"
              value={productData.dimensions?.height || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              min="0"
              step="0.1"
            />
            <input
              type="number"
              name="weight"
              placeholder="Weight"
              value={productData.weight || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              min="0"
              step="0.01"
            />
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Sizes
            </label>
            <Select
              isMulti
              name="sizes"
              options={["XS", "S", "M", "L", "XL", "XXL"].map((size) => ({
                value: size,
                label: size,
              }))}
              value={productData.sizes.map((size) => ({
                value: size,
                label: size,
              }))}
              onChange={(selected) => handleMultiSelect(selected, "sizes")}
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Colors
            </label>
            <Select
              isMulti
              name="colors"
              options={[
                "Red",
                "Blue",
                "Green",
                "Black",
                "White",
                "Yellow",
                "Pink",
              ].map((color) => ({ value: color, label: color }))}
              value={productData.colors.map((color) => ({
                value: color,
                label: color,
              }))}
              onChange={(selected) => handleMultiSelect(selected, "colors")}
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500"
          />
          {uploading && (
            <p className="text-blue-600 text-sm mt-2">Uploading Image...</p>
          )}
          <div className="flex gap-4 mt-4 flex-wrap">
            {productData.images.map((image, index) => (
              <div key={index} className="relative w-24 h-24 group">
                <img
                  src={image.url}
                  alt={image.altText || "Product"}
                  className="w-full h-full object-cover rounded-md shadow border"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index, image.url)}
                  disabled={deleting === index}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                >
                  {deleting === index ? (
                    <span className="animate-spin">⟳</span>
                  ) : (
                    "×"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading || deleting !== null}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 rounded-md font-medium"
        >
          {uploading || deleting !== null ? "Processing..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
