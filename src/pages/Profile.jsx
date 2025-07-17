import React, { useEffect, useState } from "react";
import MyOrders from "./MyOrdersPage";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "sonner";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentTab, setTab] = useState("My Orders");
  const [activeTab, setActiveTab] = useState("orders");
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  const handleIconClick = () => {
    alert("Open profile settings or image upload!");
  };

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

  // Dummy add address handler (connect to backend later)
  const handleAddAddress = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAddress = {
      address: formData.get("address"),
      city: formData.get("city"),
      postalCode: formData.get("postalCode"),
      country: formData.get("country"),
    };

    toast.success("Address added! (Connect backend to save)");
    e.target.reset();
  };
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/addresses`,
          {
            headers: { userid: user?._id },
          }
        );
        setAddresses(data);
      } catch (err) {
        console.error("Failed to load addresses", err);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/addresses`,
        newAddress,
        {
          headers: { userid: user._id },
        }
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
        {
          headers: { userid: user._id },
        }
      );
      setAddresses(data.addresses);
      toast.success("Address deleted");
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Left section */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6 flex flex-col items-center text-center bg-white relative self-start">
            {/* Profile Icon/Image */}
            <div
              className="relative cursor-pointer group"
              onClick={handleIconClick}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 hover:scale-105 transition-transform"
                />
              ) : (
                <FaUserCircle className="text-gray-500 text-7xl hover:scale-105 transition-transform" />
              )}
              <span
                className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
            </div>

            {/* Online/Offline Status */}
            <p
              className={`mt-3 text-sm font-medium flex items-center gap-2 ${
                isOnline
                  ? "text-green-600 bg-green-100"
                  : "text-red-500 bg-red-100"
              } p-1 px-3 rounded-full`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-600" : "bg-red-500"
                }`}
              ></span>
              {isOnline ? "Online" : "Offline"}
            </p>

            {/* User Info */}
            <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-2">
              {user?.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{user?.email}</p>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-400 to-red-700 text-white py-2 px-4 rounded hover:bg-red-600 transition flex items-center justify-center gap-2"
            >
              <AiOutlineLogout className="text-lg" />
              Logout
            </button>
          </div>

          {/* Right section */}
          {/* Right section with tabs */}
          <div className="w-full md:h-2/3 lg:w-3/4">
            <div className="bg-white shadow-md rounded-lg">
              <div className="flex justify-center gap-4 p-4 bg-gray-100 rounded-t-lg">
                <button
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeTab === "orders"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  My Orders
                </button>
                <button
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeTab === "address"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("address")}
                >
                  Address Book
                </button>
                {/* <button
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeTab === "coupons"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("coupons")}
                >
                  Coupons
                </button> */}
              </div>

              <div className="p-6">
                {activeTab === "orders" ? (
                  <MyOrders />
                ) : (
                  <div>
                    {/* Add new address */}
                    <h3 className="text-xl font-semibold mb-2">
                      Add New Address
                    </h3>
                    <form
                      onSubmit={handleAddressSubmit}
                      className="space-y-6 w-full p-6 rounded-xl bg-white shadow-lg border border-gray-200"
                    >
                      {/* Street Address */}
                      <div className="relative z-0 w-full group">
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={newAddress.address}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              address: e.target.value,
                            })
                          }
                          className="block py-3 px-2 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          required
                        />
                        <label
                          htmlFor="address"
                          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
                        >
                          Street Address
                        </label>
                      </div>

                      {/* City + Postal Code */}
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* City */}
                        <div className="relative z-0 w-full group">
                          <input
                            type="text"
                            name="city"
                            id="city"
                            value={newAddress.city}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                city: e.target.value,
                              })
                            }
                            className="block py-3 px-2 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                          />
                          <label
                            htmlFor="city"
                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
                          >
                            City
                          </label>
                        </div>

                        {/* Postal Code */}
                        <div className="relative z-0 w-full group">
                          <input
                            type="text"
                            name="postalCode"
                            id="postalCode"
                            value={newAddress.postalCode}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                postalCode: e.target.value,
                              })
                            }
                            className="block py-3 px-2 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                          />
                          <label
                            htmlFor="postalCode"
                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
                          >
                            Postal Code
                          </label>
                        </div>
                      </div>

                      {/* Country + Phone */}
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Country Dropdown */}
                        <div className="w-full relative">
                          <select
                            value={newAddress.country}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                country: e.target.value,
                              })
                            }
                            className="w-full py-3 px-2 text-sm border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select Country</option>
                            <option value="India">🇮🇳 India</option>
                            <option value="USA">🇺🇸 USA</option>
                            <option value="UK">🇬🇧 UK</option>
                            <option value="Germany">🇩🇪 Germany</option>
                            <option value="Australia">🇦🇺 Australia</option>
                          </select>
                        </div>

                        {/* Phone Number */}
                        <div className="relative z-0 w-full group">
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={newAddress.phone || ""}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                phone: e.target.value,
                              })
                            }
                            className="block py-3 px-2 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                          />
                          <label
                            htmlFor="phone"
                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
                          >
                            Phone Number (optional)
                          </label>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-sky-500 text-white w-full py-3 rounded-lg font-semibold hover:opacity-90 hover:scale-[1.01] shadow-md transition-all duration-300"
                      >
                        Save Address
                      </button>
                    </form>

                    {/* Saved addresses */}
                    <h3 className="text-xl font-semibold mb-4 mt-8">
                      Saved Addresses
                    </h3>
                    {addresses.length === 0 ? (
                      <p className="text-gray-600 mb-4">
                        No saved addresses yet.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        {addresses.map((addr, idx) => (
                          <div
                            key={idx}
                            className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
                          >
                            {/* Delete button top-right */}
                            <button
                              onClick={() => handleDeleteAddress(idx)}
                              className="absolute top-3 right-3 text-red-500 hover:text-red-600 transition"
                              title="Delete address"
                            >
                              <FaTrash
                                size={18}
                                className="hover:scale-110 transition-transform"
                              />
                            </button>

                            {/* Address Content */}
                            <div className="space-y-1.5 text-sm text-gray-700">
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
                                  {addr.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
