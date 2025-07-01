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
  const { token } = useSelector((state) => state.auth); // Get token from auth state
  
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
  });

  const [uploading, setUploading] = useState(false); // Image uploading state
  const [deleting, setDeleting] = useState(null); // Track which image is being deleted

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
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
            "Authorization": `Bearer ${token}` // Add authorization header
          },
        }
      );
      
      setProductData((prevData) => ({
        ...prevData,
        images: [
          ...prevData.images, 
          { 
            url: data.imageUrl, 
            altText: "",
            publicId: data.publicId // Store publicId for easier deletion
          }
        ],
      }));
      setUploading(false);
      
      // Clear the file input
      e.target.value = '';
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleImageRemove = async (index, imageUrl) => {
    try {
      setDeleting(index);
      
      // Call the delete API
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload/delete`,
        { imageUrl },
        {
          headers: {
            "Authorization": `Bearer ${token}` // Add authorization header
          }
        }
      );

      // Remove image from state
      setProductData((prevData) => ({
        ...prevData,
        images: prevData.images.filter((_, i) => i !== index),
      }));

      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      // Still remove from UI even if Cloudinary deletion fails
      setProductData((prevData) => ({
        ...prevData,
        images: prevData.images.filter((_, i) => i !== index),
      }));
      console.warn("Image removed from product but may still exist in Cloudinary");
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
  if (error) return <p> Error: {error} </p>;

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Product Name
          </label>
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
          <label className="block font-semibold text-gray-700 mb-2">
            Description
          </label>
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
            <label className="block font-semibold text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Count in Stock
            </label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              SKU
            </label>
            <input
              type="text"
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
            <label className="block font-semibold text-gray-700 mb-2">
              Sizes (comma-separated)
            </label>
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
            <label className="block font-semibold text-gray-700 mb-2">
              Colors (comma-separated)
            </label>
            <input
              type="text"
              name="colors"
              value={productData.colors.join(", ")}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  colors: e.target.value
                    .split(",")
                    .map((color) => color.trim()),
                })
              }
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 disabled:opacity-50"
          />
          {uploading && (
            <p className="text-blue-600 text-sm mt-2">Uploading Image...</p>
          )}
          
          {/* Image Gallery */}
          <div className="flex gap-4 mt-4 flex-wrap">
            {productData.images.map((image, index) => (
              <div key={index} className="relative w-24 h-24 group">
                <img
                  src={image.url}
                  alt={image.altText || "Product"}
                  className="w-full h-full object-cover rounded-md shadow border"
                />
                
                {/* Delete button overlay */}
                <button
                  type="button"
                  onClick={() => handleImageRemove(index, image.url)}
                  disabled={deleting === index}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors duration-200 disabled:opacity-50"
                  title="Remove image"
                >
                  {deleting === index ? (
                    <span className="animate-spin">⟳</span>
                  ) : (
                    "×"
                  )}
                </button>
                
                {/* Optional: Image index number */}
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-tr">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          {productData.images.length === 0 && (
            <p className="text-gray-500 text-sm mt-2">No images uploaded yet.</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || deleting !== null}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 rounded-md font-medium transition-colors duration-200"
        >
          {uploading || deleting !== null ? "Processing..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;