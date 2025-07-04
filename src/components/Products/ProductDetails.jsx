import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts(productFetchId));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") {
      setQuantity((prev) => prev + 1);
    }
    if (action === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.", {
        duration: 1500,
      });
      return;
    }
    setIsButtonDisabled(true);
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product added to cart!!", { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) return <ProductDetailsSkeleton />;

  if (error) return <p>Error: {error}</p>;

  const calculateOriginalPrice = () => {
    if (selectedProduct.discountPrice && selectedProduct.offerPercentage > 0) {
      return Math.floor(
        (selectedProduct.discountPrice * 100) /
          (100 - selectedProduct.offerPercentage)
      );
    }
    return selectedProduct.discountPrice || selectedProduct.price;
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 via-white to-sky-100 min-h-screen py-10 px-4">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumb ${index}`}
                  className={`w-20 h-20 rounded-xl cursor-pointer border transition-all duration-300 ${
                    mainImage === image.url
                      ? "border-sky-600 shadow-lg scale-105"
                      : "border-gray-300 hover:border-sky-400"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Main Image + Characteristics */}
            <div className="md:w-1/2 w-full">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="Main Product"
                  className="w-full h-[400px] object-contain rounded-3xl transition-all duration-500 bg-white p-4"
                />
              ) : (
                <div className="w-full h-[300px] flex items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                  No image available
                </div>
              )}

              {/* Mobile Thumbnails */}
              <div className="flex md:hidden mt-4 space-x-4 overflow-x-auto scrollbar-hide">
                {selectedProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.altText || `Thumb ${index}`}
                    className={`w-20 h-20 rounded-xl cursor-pointer border transition-all duration-300 ${
                      mainImage === image.url
                        ? "border-sky-600 shadow-lg scale-105"
                        : "border-gray-300 hover:border-sky-400"
                    }`}
                    onClick={() => setMainImage(image.url)}
                  />
                ))}
              </div>

              {/* Characteristics */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  Characteristics
                </h3>
                <table className="w-full text-sm text-gray-800 bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
                  <thead className="bg-gray-100 text-left text-xs uppercase tracking-wider text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Attribute</th>
                      <th className="px-4 py-3">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium">Brand</td>
                      <td className="px-4 py-3">{selectedProduct.brand}</td>
                    </tr>
                    <tr className="bg-gray-50 hover:bg-gray-100 transition">
                      <td className="px-4 py-3 font-medium">Material</td>
                      <td className="px-4 py-3">{selectedProduct.material}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium">Gender</td>
                      <td className="px-4 py-3">{selectedProduct.gender}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {selectedProduct.name}
                </h1>

                {/* Ratings */}
                {selectedProduct.rating && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400 text-lg">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i}>
                          {i < Math.floor(selectedProduct.rating) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({selectedProduct.rating.toFixed(1)} •{" "}
                      {selectedProduct.numReviews || 0} review
                      {selectedProduct.numReviews === 1 ? "" : "s"})
                    </span>
                  </div>
                )}

                {/* Pricing */}
                {selectedProduct.discountPrice &&
                selectedProduct.offerPercentage ? (
                  <div className="mb-4">
                    <div className="text-gray-500 line-through text-lg">
                      ₹{calculateOriginalPrice()}
                    </div>
                    <div className="text-6xl font-semibold text-sky-700">
                      ₹{selectedProduct.price}
                    </div>
                    <div className="text-green-600 font-medium">
                      {selectedProduct.discountPrice}% OFF
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-gray-500 line-through text-lg">
                      ₹
                      {Math.floor(
                        (selectedProduct.price * 100) /
                          (100 - selectedProduct.discountPrice)
                      )}
                    </div>
                    <div className="text-2xl font-semibold text-sky-700">
                      ₹{selectedProduct.price}
                    </div>
                    <div className="text-green-600 font-medium">
                      {selectedProduct.discountPrice}% OFF
                    </div>
                  </div>
                )}

                <p className="text-gray-600 mb-6">
                  {selectedProduct.description}
                </p>

                {/* Colors */}
                <div className="mb-6">
                  <p className="font-medium text-gray-700 mb-2">Color:</p>
                  <div className="flex gap-3">
                    {selectedProduct.colors.map((color) => (
                      <button
                        onClick={() => setSelectedColor(color)}
                        key={color}
                        className={`w-9 h-9 rounded-full border transition-all duration-300 ${
                          selectedColor === color
                            ? "border-4 border-sky-600 scale-110"
                            : "border-gray-300 hover:border-gray-500"
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <p className="font-medium text-gray-700 mb-2">Size:</p>
                  <div className="flex gap-3">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        onClick={() => setSelectedSize(size)}
                        key={size}
                        className={`px-4 py-2 rounded-xl border transition-all duration-200 font-medium ${
                          selectedSize === size
                            ? "bg-sky-600 text-white"
                            : "border-gray-300 hover:bg-sky-50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <p className="font-medium text-gray-700 mb-2">Quantity:</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange("minus")}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      -
                    </button>
                    <span className="text-lg">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange("plus")}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Stock Info */}
                <div className="mb-6">
                  <p className="font-medium text-gray-700 mb-1">
                    Stock Available:
                  </p>
                  <span
                    className={`font-semibold text-lg ${
                      selectedProduct.countInStock < 10
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {selectedProduct.countInStock} item
                    {selectedProduct.countInStock === 1 ? "" : "s"} in stock
                  </span>
                  {selectedProduct.countInStock < 10 && (
                    <p className="text-sm text-red-500 mt-1 animate-pulse">
                      Hurry! Only few left in stock.
                    </p>
                  )}
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isButtonDisabled}
                  className={`group relative w-full inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold text-white shadow-md transition-all duration-300 ease-in-out
    ${
      isButtonDisabled
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-sky-600 hover:bg-sky-700 active:scale-95"
    }
  `}
                >
                  {!isButtonDisabled && (
                    <HiOutlineShoppingBag className="text-xl group-hover:scale-110 transition-transform duration-300" />
                  )}
                  <span className="relative z-10">
                    {isButtonDisabled ? "Adding..." : "Add to Cart"}
                  </span>

                  {!isButtonDisabled && (
                    <span className="absolute inset-0 rounded-full bg-white opacity-10 group-hover:animate-pulse z-0" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              You May Also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};
const ProductDetailsSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 md:p-12 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="hidden md:flex flex-col space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} width={80} height={80} circle />
          ))}
        </div>

        <div className="md:w-1/2 w-full">
          <Skeleton height={400} className="rounded-3xl" />
          <div className="flex md:hidden mt-4 space-x-4 overflow-x-auto scrollbar-hide">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} width={80} height={80} circle />
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <Skeleton height={20} width={150} />
            <Skeleton height={80} />
          </div>
        </div>

        <div className="md:w-1/2 space-y-4">
          <Skeleton height={40} width={`80%`} />
          <Skeleton height={20} width={`60%`} />
          <Skeleton height={30} width={`30%`} />
          <Skeleton height={60} />
          <Skeleton height={20} width={`40%`} />
          <Skeleton count={3} height={20} />
          <Skeleton height={45} width={`100%`} className="rounded-full" />
        </div>
      </div>

      <div className="mt-20">
        <Skeleton height={30} width={200} className="mx-auto mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={250} className="rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
