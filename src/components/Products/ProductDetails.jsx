import React, { useEffect, useState, useMemo } from "react";
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
import { BsPatchCheckFill } from "react-icons/bs";

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
  // const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(
    selectedProduct?.countInStock === 0
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);

  // New state for pincode delivery check
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);
  const [showDeliveryCheck, setShowDeliveryCheck] = useState(false);

  const productFetchId = productId || id;
  const [sortOption, setSortOption] = useState("newest");
  const [expandedReviews, setExpandedReviews] = useState({});
  const [showAllReviews, setShowAllReviews] = useState(false);

  // ✅ Inside your ProductDetails component (near useState declarations)
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [finalPrice, setFinalPrice] = useState(null);

  useEffect(() => {
  const applyCoupon = () => {
    if (selectedProduct && user) {
      const regDate = new Date(user.createdAt);
      const today = new Date();
      const daysSinceRegistration = Math.floor(
        (today - regDate) / (1000 * 60 * 60 * 24)
      );

      if (
        couponCode.trim().toUpperCase() === "FIRST10" &&
        daysSinceRegistration <= 10
      ) {
        const discounted =
          selectedProduct.price - selectedProduct.price * 0.1;
        setFinalPrice(Math.round(discounted));
        return;
      }
    }
    setFinalPrice(null); // fallback
  };

  applyCoupon();
}, [couponCode, selectedProduct, user]);

  

  // ✅ Function to handle image click
  const handleImageClick = (imgUrl) => {
    setModalImage(imgUrl);
    setShowModal(true);
  };

  // ✅ Function to close modal
  const handleCloseModal = () => setShowModal(false);

  // ✅ Optional: close on Esc key
  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === "Escape") handleCloseModal();
    };
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setIsButtonDisabled(selectedProduct.countInStock === 0);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts(productFetchId));

      setSelectedColor("");
      setSelectedSize("");
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const sortedReviews = useMemo(() => {
    if (sortOption === "highest") {
      return [...reviews].sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "lowest") {
      return [...reviews].sort((a, b) => a.rating - b.rating);
    } else {
      return [...reviews].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
  }, [sortOption, reviews]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/reviews/product/${productFetchId}`
        );
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    if (productFetchId) {
      fetchReviews();
    }
  }, [productFetchId]);

  const handleQuantityChange = (action) => {
    if (action === "plus") {
      setQuantity((prev) => prev + 1);
    }
    if (action === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Function to check actual pincode delivery availability
  const checkDeliveryAvailability = async (pincode) => {
    setIsCheckingDelivery(true);

    // Validate pincode format
    const isValidPincode = /^\d{6}$/.test(pincode);

    if (!isValidPincode) {
      setDeliveryInfo({
        isDeliverable: false,
        message: "Please enter a valid 6-digit pincode",
      });
      setIsCheckingDelivery(false);
      return;
    }

    try {
      // Get pincode details from India Post API
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0].Status === "Error") {
        setDeliveryInfo({
          isDeliverable: false,
          message: "Invalid pincode. Please check and try again.",
        });
        setIsCheckingDelivery(false);
        return;
      }

      // Get the location details
      const location = data[0].PostOffice[0];
      const district = location.District;
      const state = location.State;

      // Calculate distance using Haversine formula
      // You should replace these coordinates with your actual warehouse/store location
      const warehouseLocation = {
        lat: 22.5726, // Kolkata coordinates (replace with your actual location)
        lon: 88.3639,
      };

      // Get approximate coordinates for the pincode location
      // This is a simplified approach - you might want to use a proper geocoding service
      const locationCoordinates = await getLocationCoordinates(district, state);

      if (!locationCoordinates) {
        setDeliveryInfo({
          isDeliverable: false,
          message:
            "Unable to verify delivery location. Please contact support.",
        });
        setIsCheckingDelivery(false);
        return;
      }

      const distance = calculateDistance(
        warehouseLocation.lat,
        warehouseLocation.lon,
        locationCoordinates.lat,
        locationCoordinates.lon
      );

      const isDeliverable = distance <= 30;

      const currentDate = new Date();
      const deliveryDate = new Date(currentDate);
      deliveryDate.setDate(
        currentDate.getDate() +
          (isDeliverable ? Math.floor(Math.random() * 5) + 2 : 0)
      ); // 2-6 days

      setDeliveryInfo({
        isDeliverable,
        message: isDeliverable
          ? `Delivery available - within 30km radius (${distance.toFixed(
              1
            )}km away)`
          : `Not deliverable - beyond 30km radius (${distance.toFixed(
              1
            )}km away)`,
        deliveryDate: isDeliverable
          ? deliveryDate.toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : null,
        deliveryDays: isDeliverable
          ? Math.ceil((deliveryDate - currentDate) / (1000 * 60 * 60 * 24))
          : null,
        location: `${district}, ${state}`,
      });
    } catch (error) {
      console.error("Error checking delivery:", error);
      setDeliveryInfo({
        isDeliverable: false,
        message: "Error checking delivery availability. Please try again.",
      });
    } finally {
      setIsCheckingDelivery(false);
    }
  };

  // Function to get approximate coordinates for a location
  const getLocationCoordinates = async (district, state) => {
    try {
      // Using OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          district
        )},${encodeURIComponent(state)},India&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting coordinates:", error);
      return null;
    }
  };

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const handleDeliveryCheck = () => {
    if (pincode.trim()) {
      checkDeliveryAvailability(pincode.trim());
    } else {
      toast.error("Please enter a pincode", { duration: 1500 });
    }
  };

  // const handleAddToCart = () => {
  //   if (!selectedSize || !selectedColor) {
  //     toast.error("Please select a size and color before adding to cart.", {
  //       duration: 1500,
  //     });
  //     return;
  //   }
  //   setIsButtonDisabled(true);
  //   setIsAddingToCart(true); // <- start loading
  //   dispatch(
  //     addToCart({
  //       productId: productFetchId,
  //       quantity,
  //       size: selectedSize,
  //       color: selectedColor,
  //       guestId,
  //       userId: user?._id,
  //     })
  //   )
  //     .then(() => {
  //       toast.success("Product added to cart!!", { duration: 1000 });
  //     })
  //     .finally(() => {
  //       setIsButtonDisabled(false);
  //       setIsAddingToCart(false); // <- stop loading
  //     });
  // };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.", {
        duration: 1500,
      });
      return;
    }

    const currentCartItems = JSON.parse(
      localStorage.getItem("persist:root")
    )?.cart;
    const totalProductsInCart = currentCartItems
      ? JSON.parse(currentCartItems)?.cartItems?.reduce(
          (acc, item) => acc + item.quantity,
          0
        )
      : 0;

    if (totalProductsInCart + quantity > 10) {
      toast.error("You can buy up to 10 items", { duration: 2000 });
      return;
    }

    setIsButtonDisabled(true);
    setIsAddingToCart(true);
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
        setIsAddingToCart(false);
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

  const formatReviewDate = (isoDate) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(isoDate).toLocaleDateString("en-IN", options);
  };
  const totalReviews = reviews.length || 1;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return {
      star,
      count,
      percentage: Math.round((count / totalReviews) * 100),
    };
  });

 



  return (
    <div className=" min-h-screen py-10 px-4">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md shadow-lg rounded p-8 md:p-12">
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
                  onClick={() => handleImageClick(mainImage)}
                  className="w-full h-[400px] object-contain rounded-lg transition-all duration-500 bg-white p-4 border border-gray-300 cursor-zoom-in"
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
                {selectedProduct.rating > 0 &&
                  selectedProduct.numReviews > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-600 text-white px-2 p-0.5 rounded-md">
                        {selectedProduct.rating} ★
                      </span>
                      <span className="text-sm text-gray-600">
                        {selectedProduct.numReviews} review
                        {selectedProduct.numReviews === 1 ? "" : "s"}
                      </span>
                    </div>
                  )}

                {/* Pricing */}
                {selectedProduct.discountPrice &&
                selectedProduct.offerPercentage ? (
                  <div className="mb-4">
                    <div className="flex items-end gap-4">
                      <div className="text-4xl font-semibold text-sky-700">
                        ₹{selectedProduct.discountPrice}
                      </div>
                      <div className="text-gray-500 line-through text-xl">
                        ₹{selectedProduct.price}
                      </div>
                    </div>
                    <div className="text-green-600 font-medium mt-1">
                      {selectedProduct.offerPercentage}% OFF
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="flex items-end gap-4">
                      <div className="text-4xl font-semibold text-sky-700">
                        ₹{selectedProduct.price}
                      </div>
                      <div className="text-gray-500 line-through text-xl">
                        ₹
                        {Math.floor(
                          (selectedProduct.price * 100) /
                            (100 - selectedProduct.discountPrice)
                        )}
                      </div>
                    </div>
                    <div className="text-green-600 font-medium mt-1">
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
                {/* 🏷️ Apply Coupon */}
                {/* <div className="mb-6">
                  <p className="font-medium text-gray-700 mb-2">
                    Apply Coupon Code:
                  </p>
                  <input
                    type="text"
                    placeholder="Enter your coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  {finalPrice && (
                    <p className="text-green-600 mt-2 font-medium">
                      Coupon Applied! Discounted Price: ₹{finalPrice}
                    </p>
                  )}
                </div> */}

                {/* Quantity */}

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

                  {selectedProduct.countInStock === 0 ? (
                    <span className="font-semibold text-lg text-red-600">
                      Out of Stock
                    </span>
                  ) : selectedProduct.countInStock < 10 ? (
                    <>
                      <span className="font-semibold text-lg text-red-600">
                        Hurry! Only {selectedProduct.countInStock} item
                        {selectedProduct.countInStock === 1 ? "" : "s"} left
                      </span>
                      <p className="text-sm text-red-500 mt-1 animate-pulse">
                        Almost gone! Order soon.
                      </p>
                    </>
                  ) : (
                    <span className="font-semibold text-lg text-green-600">
                      In Stock
                    </span>
                  )}
                </div>
                {/* <div className="mb-6">
  <p className="font-medium text-gray-700 mb-2">Apply Coupon Code:</p>
  <input
    type="text"
    placeholder="Enter coupon (e.g., FIRST10)"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
  />
  {finalPrice && (
    <p className="text-green-600 mt-2 font-medium">
      Coupon Applied! Discounted Price: ₹{finalPrice}
    </p>
  )}
</div> */}

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
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                  </span>

                  {!isButtonDisabled && (
                    <span className="absolute inset-0 rounded-full bg-white opacity-10 group-hover:animate-pulse z-0" />
                  )}
                </button>

                {/* Pincode Delivery Check */}
                {/* <div className="mt-6 p-4 bg-sky-50 rounded-xl border border-sky-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🚚</span>
                    <p className="font-medium text-gray-700">
                      Check Delivery Availability
                    </p>
                  </div>

                  <div className="flex gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Enter pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      maxLength={6}
                    />
                    <button
                      onClick={handleDeliveryCheck}
                      disabled={isCheckingDelivery}
                      className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                    >
                      {isCheckingDelivery ? "Checking..." : "Check"}
                    </button>
                  </div>

                  {deliveryInfo && (
                    <div
                      className={`p-3 rounded-lg ${
                        deliveryInfo.isDeliverable
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">
                          {deliveryInfo.isDeliverable ? "" : ""}
                        </span>
                        <span
                          className={`font-medium ${
                            deliveryInfo.isDeliverable
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {deliveryInfo.message}
                        </span>
                      </div>

                      {deliveryInfo.isDeliverable &&
                        deliveryInfo.deliveryDate && (
                          <div className="text-sm text-green-600">
                            <p>
                              <strong>Location:</strong> {deliveryInfo.location}
                            </p>
                            <p>
                              <strong>Estimated Delivery:</strong>{" "}
                              {deliveryInfo.deliveryDate}
                            </p>
                            <p>
                              <strong>Delivery Time:</strong>{" "}
                              {deliveryInfo.deliveryDays} days from today
                            </p>
                          </div>
                        )}

                      {!deliveryInfo.isDeliverable && deliveryInfo.location && (
                        <div className="text-sm text-red-600">
                          <p>
                            <strong>Location:</strong> {deliveryInfo.location}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          </div>

          <div className="mt-16 mb-16 flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar: Rating Breakdown with Bars */}
            <div className="lg:w-1/4 w-full bg-gradient-to-b from-white via-sky-50 to-sky-100 border border-sky-100 rounded-2xl p-6 shadow-lg h-fit">
              <h3 className="text-lg font-semibold text-sky-800 mb-4">
                Rating Breakdown
              </h3>
              <div className="space-y-4">
                {ratingCounts.map(({ star, count, percentage }) => (
                  <div key={star} className="space-y-1">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="font-medium">{star}</span>
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Review Section */}
            <div className="lg:w-3/4 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                  Customer Reviews
                </h2>
                <div className="mt-4 sm:mt-0">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
                  >
                    <option value="newest">Newest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                  </select>
                </div>
              </div>

              {sortedReviews.length > 0 ? (
                <>
                  <div className="space-y-8">
                    {sortedReviews.slice(0, 3).map((review, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-white to-sky-50 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold text-lg shadow-inner ring-1 ring-sky-300">
                              {review.user?.name?.charAt(0).toUpperCase() ||
                                "U"}
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-800 tracking-wide">
                                {review.user?.name || "Anonymous"}
                              </h4>
                              <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <span
                                    key={i}
                                    className={`text-xl ${
                                      i < review.rating
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                                <span className="ml-2 text-sm text-gray-500">
                                  {review.rating}/5
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 font-medium">
                            <span className="text-black">Posted On: </span>
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-IN"
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>

                  {sortedReviews.length > 3 && (
                    <div className="text-center mt-6">
                      <button
                        onClick={() => setShowAllReviews(true)}
                        className="px-4 py-2 text-sm font-semibold text-sky-700 border border-sky-400 rounded hover:bg-sky-50 transition"
                      >
                        View More Reviews
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-sky-50 border border-sky-100 text-center p-8 rounded-xl text-gray-500 shadow-inner">
                  <p>No reviews yet.</p>
                </div>
              )}

              {showAllReviews && (
                <div
                  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => setShowAllReviews(false)}
                >
                  <div
                    className="bg-white max-w-3xl w-full max-h-[80vh] overflow-y-auto rounded-xl shadow-xl p-6 relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setShowAllReviews(false)}
                      className="absolute top-3 right-4 text-gray-600 hover:text-red-600 text-2xl"
                    >
                      ✕
                    </button>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      All Reviews
                    </h3>
                    <div className="space-y-6">
                      {sortedReviews.map((review, index) => (
                        <div key={index} className="border-b pb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-800">
                              {review.user?.name || "Anonymous"}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-yellow-400 mb-1">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                          <p className="text-gray-700 text-sm">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
      {/* 🔍 Image Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="w-full h-full max-w-5xl max-h-screen relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white hover:text-red-400 text-3xl font-bold z-50"
            >
              ✕
            </button>

            {/* Zoomable Image */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden touch-pinch-zoom">
              <img
                src={modalImage}
                alt="Zoomed Product"
                className="max-w-full max-h-full object-contain transition-transform duration-300"
                style={{ touchAction: "pan-x pan-y", userSelect: "none" }}
              />
            </div>
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
