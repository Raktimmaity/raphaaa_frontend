import React, { useEffect, useState } from "react";
import MyOrders from "./MyOrdersPage";
import { FaUserCircle, FaTrash } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import axios from "axios";
import { FaHeart, FaMapMarkerAlt, FaCog, FaBoxOpen } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RiCoupon2Fill } from "react-icons/ri";
import { FaLocationCrosshairs } from "react-icons/fa6";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeTab, setActiveTab] = useState("orders");
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [editField, setEditField] = useState(null); // e.g. "name", "email"
  const [editValue, setEditValue] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [copied, setCopied] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (!Array.isArray(data)) throw new Error("Invalid data structure");

        const countries = data
          .map((country) => country?.name?.common)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        setCountryList(countries);
      } catch (error) {
        console.error("Failed to load countries:", error.message);
        toast.error("Could not load country list.");
        setCountryList(["India", "United States", "Canada", "Australia"]); // fallback
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const token = user?.token || localStorage.getItem("userToken");
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/my-coupon`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCoupon(data);
        setCouponError("");
      } catch (err) {
        setCoupon(null);
        setCouponError(
          err.response?.data?.message || "Could not fetch coupon details"
        );
      }
    };

    if (activeTab === "coupon" && user?.role === "customer") {
      fetchCoupon();
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWishlistItems(data);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      }
    };

    if (activeTab === "wishlist") fetchWishlist();
  }, [activeTab]);

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
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  const handleIconClick = () => alert("Open profile settings or image upload!");

  useEffect(() => {
    const handleOnline = () => {
      if (!isOnline) {
        setIsOnline(true);
        toast.success("You're back online");
      }
    };
    const handleOffline = () => {
      if (isOnline) {
        setIsOnline(false);
        toast.error("You're offline");
      }
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/addresses`,
          { headers: { userid: user?._id } }
        );
        setAddresses(data);
      } catch (err) {
        console.error("Failed to load addresses", err);
      }
    };
    if (user) fetchAddresses();
  }, [user]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/addresses`,
        newAddress,
        { headers: { userid: user._id } }
      );
      setAddresses(data.addresses);
      toast.success("Address saved!");
      setNewAddress({
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
      });
    } catch (err) {
      toast.error("Failed to save address");
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/addresses/${index}`,
        { headers: { userid: user._id } }
      );
      setAddresses(data.addresses);
      toast.success("Address deleted");
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser.");
    }

    setLocating(true); // ⬅️ start spinner

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const { address } = data;

          if (!address) {
            toast.error("Unable to extract address.");
            return;
          }

          setNewAddress((prev) => ({
            ...prev,
            address:
              address.road ||
              address.neighbourhood ||
              address.suburb ||
              address.display_name ||
              "",
            city: address.city || address.town || address.village || "",
            postalCode: address.postcode || "",
            country: address.country || "",
          }));

          toast.success("Address auto-filled from current location!");
        } catch (err) {
          console.error("Geolocation fetch error:", err);
          toast.error("Failed to fetch address from coordinates.");
        } finally {
          setLocating(false); // ⬅️ stop spinner
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        switch (err.code) {
          case 1:
            toast.error("Permission denied. Please allow location access.");
            break;
          case 2:
            toast.error("Location unavailable.");
            break;
          case 3:
            toast.error("Request timed out.");
            break;
          default:
            toast.error("Unknown geolocation error.");
        }
        setLocating(false); // ⬅️ stop spinner on error too
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };




  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          <div className="w-full md:w-1/3 lg:w-1/4 bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-xl rounded-2xl p-6 flex flex-col items-center text-center border border-blue-100 relative self-start transition-all duration-300">
            <div
              className="relative cursor-pointer group"
            // onClick={handleIconClick}
            >
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-4 border-white text-blue-700 font-bold text-xl uppercase shadow hover:scale-105 transition-transform">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}


              <span
                className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
              ></span>
            </div>

            <p
              className={`mt-3 text-sm font-medium flex items-center gap-2 ${isOnline
                ? "text-green-600 bg-green-100"
                : "text-red-500 bg-red-100"
                } px-3 py-1 rounded-full shadow-inner`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-600" : "bg-red-500"
                  }`}
              ></span>
              {isOnline ? "Online" : "Offline"}
            </p>

            <h1 className="text-2xl md:text-3xl font-extrabold mt-3 mb-1 text-gray-800">
              {user?.name}
            </h1>
            <p className="text-base text-gray-600 mb-6 italic tracking-wide">
              {user?.email}
            </p>

            <div className="w-full mt-4 space-y-2 text-left">
              {[
                "orders",
                "wishlist",
                "address",
                "profile",
                // "coupon",
                // "settings",
              ].map((key) => {
                const icons = {
                  orders: <FaBoxOpen className="mr-2" />,
                  wishlist: <FaHeart className="mr-2" />,
                  address: <FaMapMarkerAlt className="mr-2" />,
                  // settings: <FaCog className="mr-2" />,
                  profile: <FaUserCircle className="mr-2" />,
                  // coupon: <RiCoupon2Fill className="mr-2" />,
                };

                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full flex items-center text-sm font-medium px-4 py-2 transition-all duration-200 ${activeTab === key
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50"
                      }`}
                  >
                    {icons[key]}{" "}
                    {key === "orders"
                      ? "My Orders"
                      : key[0].toUpperCase() + key.slice(1)}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <AiOutlineLogout className="text-lg" /> Logout
            </button>
          </div>

          <div className="w-full md:h-2/3 lg:w-3/4">
            <div className="p-6">
              {activeTab === "orders" && <MyOrders />}
              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>
                  {wishlistItems.length === 0 ? (
                    <p className="text-gray-500">Your wishlist is empty.</p>
                  ) : (
                    <div className="space-y-6">
                      {wishlistItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-white via-blue-50 to-blue-100 border border-blue-100 rounded-2xl p-6 shadow hover:shadow-lg transition-all"
                        >
                          <Link
                            to={`/product/${item._id}`}
                            className="flex flex-col md:flex-row items-center gap-6 w-full"
                          >
                            <img
                              src={item.images?.[0]?.url || "/placeholder.png"}
                              alt={item.name}
                              className="w-full md:w-48 h-48 object-cover rounded-xl shadow"
                            />
                            <div className="flex-1 text-center md:text-left">
                              <h3 className="text-lg font-bold text-gray-800 mb-2">
                                {item.name}
                              </h3>
                              <p className="mb-2 text-sm text-gray-600">
                                {item.description}
                              </p>
                              <p
                                className={`text-sm font-medium mb-2 ${item.countInStock < 5
                                  ? "text-red-600"
                                  : "text-green-600"
                                  }`}
                              >
                                {item.countInStock < 5
                                  ? `Hurry! Only ${item.countInStock} left in stock`
                                  : `In Stock`}
                              </p>
                            </div>
                          </Link>

                          <div className="flex justify-center md:justify-start gap-4 mt-3 md:mt-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // ⛔ Prevent navigation
                                handleRemoveFromWishlist(item._id);
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition"
                            >
                              <FaTrash /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "address" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Add New Address
                  </h3>
                  <form
                    onSubmit={handleAddressSubmit}
                    className="space-y-6 "
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="address"
                        value={newAddress.address}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            address: e.target.value,
                          })
                        }
                        placeholder="Street Address"
                        className="bg-white w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                      <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        placeholder="City"
                        className="bg-white w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="number"
                        name="postalCode"
                        value={newAddress.postalCode}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            postalCode: e.target.value,
                          })
                        }
                        placeholder="Postal Code"
                        className="bg-white w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                      <select
                        name="country"
                        value={newAddress.country}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            country: e.target.value,
                          })
                        }
                        className="bg-white w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      >
                        <option value="" disabled>Select Country</option>
                        {countryList.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>

                    </div>
                    <div className="flex justify-between items-center">
                      <input
                        type="number"
                        name="phone"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, phone: e.target.value })
                        }
                        placeholder="Phone"
                        className="bg-white w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none [-moz-appearance:textfield] [appearance:textfield]"
                      />
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={locating}
                        className="ml-2 whitespace-nowrap text-sm bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400 disabled:cursor-not-allowed text-white font-medium px-4 py-3 transition flex justify-around items-center gap-2"
                      >
                        {/* Spinner while locating */}
                        {locating ? (
                          <>
                            <span className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <FaLocationCrosshairs className="inline" size={25} />
                            Use my current Location
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 transition"
                    >
                      Save Address
                    </button>
                  </form>

                  <h3 className="text-xl font-semibold mt-6 mb-4">
                    Saved Addresses
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr, idx) => (
                      <div
                        key={idx}
                        className="relative bg-gradient-to-br from-white to-blue-50 border border-blue-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                      >
                        <button
                          onClick={() => handleDeleteAddress(idx)}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-600 hover:scale-110 transition-transform"
                          title="Delete address"
                        >
                          <FaTrash size={16} />
                        </button>

                        <div className="space-y-2 text-sm text-gray-800">
                          <p>
                            <span className="font-semibold text-gray-900">
                              Address:
                            </span>{" "}
                            {addr.address}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-900">
                              City:
                            </span>{" "}
                            {addr.city}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-900">
                              Postal Code:
                            </span>{" "}
                            {addr.postalCode}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-900">
                              Country:
                            </span>{" "}
                            {addr.country}
                          </p>
                          {addr.phone && (
                            <p>
                              <span className="font-semibold text-gray-900">
                                Phone:
                              </span>{" "}
                              +91 {addr.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    My Profile
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={user?.name}
                        disabled
                        className="bg-white mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      {/* <FaEdit
                        onClick={() => {
                          setEditField("name");
                          setEditValue(user?.name);
                        }}
                        className="absolute right-2 top-8 text-gray-500 hover:text-blue-600 cursor-pointer"
                      /> */}
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="bg-white mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      {/* <FaEdit
                        onClick={() => {
                          setEditField("email");
                          setEditValue(user?.email);
                        }}
                        className="absolute right-2 top-8 text-gray-500 hover:text-blue-600 cursor-pointer"
                      /> */}
                    </div>

                    {/* Mobile */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700">
                        Mobile
                      </label>
                      <input
                        type="text"
                        value={user?.mobile || "Not Available"}
                        disabled
                        className="bg-white mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      {/* <FaEdit
                        onClick={() => {
                          setEditField("mobile");
                          setEditValue(user?.mobile || "");
                        }}
                        className="absolute right-2 top-8 text-gray-500 hover:text-blue-600 cursor-pointer"
                      /> */}
                    </div>

                    {/* Role */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <input
                        type="text"
                        value={
                          user?.role === "admin"
                            ? "Admin"
                            : user?.role === "merchantise"
                              ? "Merchandise"
                              : user?.role === "delivery_boy"
                                ? "Delivery Boy"
                                : user?.role
                        }
                        disabled
                        className="bg-white mt-1 block w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      {/* No edit option for role */}
                    </div>
                  </div>

                  {/* <hr className="my-4" /> */}

                  {/* <h3 className="text-lg font-semibold text-gray-800">
                    Update Password
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <button
                    type="button"
                    className="mt-4 bg-blue-600 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Update Profile
                  </button> */}
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h2 className="text-xl font-semibold">Settings Page</h2>
                  <p>Settings coming soon.</p>
                </div>
              )}
              {activeTab === "coupon" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    {/* <img
                      src="https://cdn-icons-png.flaticon.com/512/514/514677.png"
                      alt="Coupon Icon"
                      className="w-6 h-6"
                    /> */}
                    My Coupons
                  </h2>

                  {/* {user?.role === "customer" ? (
                    coupon ? (
                      <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-lg p-4 shadow-md w-fit">
                        <div className="flex items-center gap-3">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/726/726476.png"
                            alt="Discount"
                            className="w-8 h-8"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-bold text-blue-700">
                                {coupon.code}
                              </p>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(coupon.code);
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                                className="text-xs text-blue-600 border border-blue-500 px-2 py-0.5 rounded hover:bg-blue-100 transition"
                              >
                                {copied ? "Copied" : "Copy"}
                              </button>
                            </div>
                            <p className="text-sm text-green-600 font-medium">
                              {coupon.discount}% off – valid until{" "}
                              {new Date(coupon.expiresAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : couponError ? (
                      <p className="text-red-600 mt-2">{couponError}</p>
                    ) : (
                      <p className="text-gray-500">Loading your coupon...</p>
                    )
                  ) : (
                    <p className="text-gray-600">
                      Coupons are only for customers.
                    </p>
                  )} */}
                </div>
              )}
            </div>
            {editField && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 capitalize">
                    Edit {editField}
                  </h3>
                  <input
                    type={editField === "email" ? "email" : "text"}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="bg-white w-full border border-gray-300 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditField(null)}
                      className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Call update API here if needed
                        toast.success(`${editField} updated to "${editValue}"`);
                        setEditField(null);
                      }}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
