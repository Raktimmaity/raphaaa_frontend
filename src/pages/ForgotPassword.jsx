import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.confirmPassword) {
      return toast.error("All fields are required");
    }

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords not matched");
    }
    setLoading(true);

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/reset-password`,
        form
      );
      toast.success(data.message || "Password reset successfully");
      setForm({ email: "", password: "", confirmPassword: "" });
      // ✅ Navigate to login page after a short delay (optional)
      setTimeout(() => navigate("/login"), 1000); // optional delay for toast
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[75vh] flex justify-center items-center p-6">
      <form onSubmit={handleSubmit} className="p-8 rounded-lg max-w-md w-full">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center w-fit">
            <h2 className="text-3xl font-bold text-gray-800">
              Forgot Password
            </h2>{" "}
            <span className="h-1 w-16 ml-3 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"></span>
          </div>
        </div>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="bg-white w-full mb-4 px-4 py-2 outline-0 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="New Password"
          className="bg-white w-full mb-4 px-4 py-2 outline-0 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="bg-white w-full mb-6 px-4 py-2 outline-0 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2.5 rounded-lg font-semibold transition ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
