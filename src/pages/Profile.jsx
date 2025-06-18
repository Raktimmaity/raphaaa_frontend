import React, { useEffect, useState } from "react";
import MyOrders from "./MyOrders";
import { FaUserCircle } from "react-icons/fa";
import { toast, Toaster } from "sonner"; // ← Import sonner
import { AiOutlineLogout } from "react-icons/ai";

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleIconClick = () => {
    alert("Open profile settings or image upload!");
  };

  useEffect(() => {
    const handleOnline = () => {
      if (!isOnline) {
        setIsOnline(true);
        toast.success("You're back online ✅");
      }
    };

    const handleOffline = () => {
      if (isOnline) {
        setIsOnline(false);
        toast.error("You're offline 🚫");
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Toaster position="top-center" richColors closeButton />  */}
      {/* Toast container */}
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* left section */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6 flex flex-col items-center text-center bg-gradient-to-br from-sky-200 to-blue-400 relative">
            {/* Profile Icon/Image Wrapper */}
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
              {/* Online Status Dot */}
              <span
                className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
            </div>

            {/* Online/Offline Status Text with Circle */}
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
              John Doe
            </h1>
            <p className="text-lg text-gray-600 mb-4">john@example.com</p>

            {/* Logout Button */}
            <button className="w-full bg-gradient-to-r from-red-300 to-red-600 text-white py-2 px-4 rounded hover:bg-red-600 transition flex items-center justify-center gap-2">
              <AiOutlineLogout className="text-lg" />
              Logout
            </button>
          </div>

          {/* right section */}
          <div className="w-full md:h-2/3 lg:w-3/4">
            <MyOrders />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
