import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import demoImg from "../../assets/login.jpg";
import { IoFlash } from "react-icons/io5";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import axios from "axios";
import { toast } from "sonner"; // since you're already using toast

const ProductGrid = ({ products = [], loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(
    window.innerWidth < 640 ? 10 : 9
  );

  // Dynamic resizing
  useEffect(() => {
    const handleResize = () => {
      setProductsPerPage(window.innerWidth < 640 ? 10 : 9);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Guard in case products is not a valid array
  const safeProducts = Array.isArray(products) ? products : [];

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = safeProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(safeProducts.length / productsPerPage);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/wishlist`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlistItems(data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlist();
  }, []);

  // 👇 Add this
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId); // ✅ Correct
  };

  //   const handleWishlistClick = async (product) => {
  //   try {
  //     const token = localStorage.getItem("userToken");

  //     const alreadyWishlisted = isInWishlist(product._id);

  //     const url = `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/${alreadyWishlisted ? "remove" : "add"}/${product._id}`;

  //     await axios[alreadyWishlisted ? "delete" : "post"](url, {}, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     toast.success(`${product.name} ${alreadyWishlisted ? "removed from" : "added to"} wishlist`);

  //     setWishlistItems((prev) =>
  //       alreadyWishlisted
  //         ? prev.filter((item) => item._id !== product._id)
  //         : [...prev, product]
  //     );
  //   } catch (error) {
  //     toast.error("Failed to update wishlist.");
  //     console.error("Wishlist error:", error);
  //   }
  // };
  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Removed from wishlist");
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/add/${product._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`${product.name} added to wishlist`);
      setWishlistItems((prev) => [...prev, product]);
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin h-10 w-10 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      </div>
    );
  }

  // Error
  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  // No products
  if (!loading && safeProducts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-center">
        <img
          src="https://i.gifer.com/7VE.gif"
          alt="No products found"
          className="w-64 h-64 object-contain mb-4"
        />
        <p className="text-2xl font-semibold text-gray-600">
          🤧 Oops! No products found
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Try adjusting your filters and search again.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-0.5">
        {currentProducts.map((product, index) => (
          <Link
            key={index}
            to={`/product/${product._id}`}
            className="block group transition-transform transform hover:-translate-y-1"
          >
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded md:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-sky-200">
              <div className="w-full h-[220px] md:h-[300px] lg:h-[300px] mb-3 relative overflow-hidden rounded-lg">
                <img
                  src={product.images?.[0]?.url || demoImg}
                  alt={product.images?.[0]?.altText || product.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />

                {/* 🟡 NEW Badge */}
                {new Date() - new Date(product.createdAt) <
                  2 * 24 * 60 * 60 * 1000 && (
                  <div className="absolute bottom-2 left-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-[10px] font-bold px-2 py-[2px] rounded-full shadow-md animate-bounce tracking-wide uppercase">
                    New
                  </div>
                )}

                {/* 💎 Raphaaa Badge */}
                <div className="absolute top-2 left-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[10px] font-bold px-2 py-[2px] rounded-full shadow-md tracking-wide flex items-center gap-1">
                  <IoFlash className="text-yellow-300 text-xs" />
                  Raphaaa Assured
                </div>

                {/* 🛒 Stock */}
                <div className="absolute bottom-2 right-2 bg-white text-blue-900 text-xs font-semibold px-2 py-1 rounded shadow-sm backdrop-blur-sm">
                  {product.countInStock === 0 ? (
                    <span className="text-red-600">Out of Stock</span>
                  ) : product.countInStock < 10 ? (
                    <span className="text-red-600">
                      Hurry up! Only {product.countInStock} left
                    </span>
                  ) : (
                    <span className="text-green-600">In Stock</span>
                  )}
                </div>
                {/* ❤️ Wishlist Button (Top Right Corner) */}
                {/* <button
                  onClick={(e) => {
                    e.stopPropagation(); // 🛑 prevent click from bubbling to parent
                    handleWishlistClick(product);
                  }}
                  title="Add to Wishlist"
                  className="absolute top-2 right-2 bg-white text-gray-800 rounded-full p-1 shadow-md hover:bg-pink-100 transition z-50"
                >
                  <AiOutlineHeart className="text-lg" />
                </button> */}
              </div>

              <div className="p-3">
                <h3 className="text-base font-semibold text-blue-900 mb-1 truncate">
                  {product.name}
                </h3>
                {product.discountPrice &&
                product.discountPrice < product.price ? (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="text-blue-700 font-bold text-2xl md:text-3xl tracking-wide">
                      ₹ {product.discountPrice}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      ₹ {product.price}
                    </p>
                    <p className="text-green-600 text-md font-semibold">
                      {product.offerPercentage}% OFF
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        isInWishlist(product._id)
                          ? handleRemoveFromWishlist(product._id)
                          : handleAddToWishlist(product);
                      }}
                      title={
                        isInWishlist(product._id)
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                      className={`ml-auto w-10 h-10 flex items-center justify-center rounded-full p-2 shadow-md transition duration-300 ease-in-out transform hover:scale-110 ${
                        isInWishlist(product._id)
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-white text-gray-800 hover:bg-pink-100"
                      }`}
                    >
                      <span className="relative inline-block transition-transform duration-300 ease-in-out">
                        {isInWishlist(product._id) ? (
                          <AiFillHeart className="text-2xl animate-pulse" />
                        ) : (
                          <AiOutlineHeart className="text-2xl" />
                        )}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-blue-700 font-bold text-2xl tracking-wide">
                      ₹ {product.price}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        isInWishlist(product._id)
                          ? handleRemoveFromWishlist(product._id)
                          : handleAddToWishlist(product);
                      }}
                      title={
                        isInWishlist(product._id)
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                      className={`ml-auto w-10 h-10 flex items-center justify-center rounded-full p-2 shadow-md transition duration-300 ease-in-out transform hover:scale-110 ${
                        isInWishlist(product._id)
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-white text-gray-800 hover:bg-pink-100"
                      }`}
                    >
                      <span className="relative inline-block transition-transform duration-300 ease-in-out">
                        {isInWishlist(product._id) ? (
                          <AiFillHeart className="text-2xl animate-pulse" />
                        ) : (
                          <AiOutlineHeart className="text-2xl" />
                        )}
                      </span>
                    </button>
                  </div>
                )}

                {product.rating > 0 && product.numReviews > 0 && (
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="text-sm bg-green-600 p-[0.2px] rounded-xl text-white px-2">
                      {product.rating} ★
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      {product.numReviews} Reviews
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-transform duration-200 ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductGrid;
