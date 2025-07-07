import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { updateProfile } from "../redux/slices/authSlice"; // ✅ Add this line

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 17) setGreeting("Good Afternoon");
      else if (hour < 21) setGreeting("Good Evening");
      else setGreeting("Good Night");
    };

    updateGreeting(); // Initial set

    const interval = setInterval(updateGreeting, 60 * 1000); // Update every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    const result = await dispatch(updateProfile(formData));
    if (result?.meta?.requestStatus === "fulfilled") {
      toast.success("Profile updated successfully");
    } else {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
      {loading && <p className="text-blue-600 font-medium">Loading...</p>}
      {error && <p className="text-red-500 font-medium">Error: {error}</p>}

      {/* ✅ Profile Card */}
      {user && (
        <div className="relative bg-gradient-to-r from-blue-50 via-white to-blue-50 border border-blue-100 shadow-xl rounded-xl mb-8 p-6 sm:flex sm:items-center sm:justify-between transition-all duration-300">
          {/* Avatar with Glow Ring */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 text-white flex items-center justify-center text-2xl font-bold shadow-md ring-4 ring-white">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            {/* Info */}
            <div>
              <h3 className="text-2xl font-bold text-blue-800 mb-1">
                {greeting}, {user.name}
              </h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Role:</span>{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                    user.role === "admin"
                      ? "bg-red-100 text-red-700"
                      : user.role === "merchantise"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {user.role === "admin"
                    ? "Admin"
                    : user.role === "merchantise"
                    ? "Merchantise"
                    : "Customer"}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                <span className="font-medium">User ID:</span> {user._id}
              </p>
            </div>
          </div>

          {/* Badge Icon */}
          <div className="hidden sm:block mt-6 sm:mt-0">
            <span
              className={`inline-flex items-center gap-2 bg-white border px-4 py-1.5 rounded-full shadow text-sm font-medium ${
                user.role === "admin"
                  ? "border-red-200 text-red-600"
                  : user.role === "merchantise"
                  ? "border-purple-200 text-purple-600"
                  : "border-green-200 text-green-600"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 016 6c0 2.137-1.262 3.992-3.098 4.897l.597 1.791a1 1 0 01-1.899.632L10 13.618l-1.6 1.702a1 1 0 01-1.9-.631l.597-1.791A5.998 5.998 0 014 8a6 6 0 016-6z" />
              </svg>
              {user.role === "admin"
                ? "Admin Access"
                : user.role === "merchantise"
                ? "Merchant Tools"
                : "Customer Account"}
            </span>
          </div>
        </div>
      )}

      <div className="p-6 bg-white shadow-md rounded-lg mb-6">
        <h3 className="text-lg font-bold mb-6">Edit Your Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 mb-1 font-medium"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 mb-1 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 mb-1 font-medium"
              >
                New Password <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
