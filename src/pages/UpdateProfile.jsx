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
        <div className="relative bg-white/80 backdrop-blur-md border border-blue-100 shadow-xl rounded-xl mb-8 p-6 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar Placeholder */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-sky-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            {/* Info */}
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-1">
                {greeting}, {user.name}
              </h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Role:</span>{" "}
                {user.role === "admin"
                  ? "Admin"
                  : user.role === "merchantise"
                  ? "Merchantise"
                  : "Customer"}
              </p>

              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                <span className="font-medium">User ID:</span> {user._id}
              </p>
            </div>
          </div>

          {/* Optional Badge / Icon */}
          <div className="hidden sm:block mt-4 sm:mt-0">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full shadow">
              Admin
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
