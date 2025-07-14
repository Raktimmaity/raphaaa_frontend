import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";

const AdminContactSettings = () => {
  const [form, setForm] = useState({
    showFacebook: false,
    facebookUrl: "",
    showInstagram: false,
    instagramUrl: "",
    showTwitter: false,
    twitterUrl: "",
    showGmail: false,
    gmail: "",
    showPhone: false,
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/settings/contact`);
        setForm(data);
      } catch (error) {
        toast.error("Failed to load contact settings");
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/settings/contact`, form);
      toast.success("Contact settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white shadow-2xl rounded-2xl mt-12 border border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-sky-700">Contact Settings</h2>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">

        {/* === SOCIAL SECTION === */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Social Links</h3>

          {/* Facebook */}
          <div className="space-y-2 mb-6">
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="showFacebook" checked={form.showFacebook} onChange={handleChange} />
              <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <FaFacebook className="text-blue-600" /> Show Facebook
              </span>
            </label>
            <input
              type="url"
              name="facebookUrl"
              placeholder="https://facebook.com/yourpage"
              value={form.facebookUrl}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Instagram */}
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="showInstagram" checked={form.showInstagram} onChange={handleChange} />
              <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <FaInstagram className="text-pink-500" /> Show Instagram
              </span>
            </label>
            <input
              type="url"
              name="instagramUrl"
              placeholder="https://instagram.com/yourhandle"
              value={form.instagramUrl}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
            />
          </div>
        </div>

        {/* === CONTACT SECTION === */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Contact Info</h3>

          {/* Gmail */}
          <div className="space-y-2 mb-6">
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="showGmail" checked={form.showGmail} onChange={handleChange} />
              <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <FaEnvelope className="text-red-500" /> Show Gmail
              </span>
            </label>
            <input
              type="email"
              name="gmail"
              placeholder="yourmail@gmail.com"
              value={form.gmail}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="showPhone" checked={form.showPhone} onChange={handleChange} />
              <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <FaPhone className="text-green-600" /> Show Phone
              </span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+91 9876543210"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>
        </div>

        {/* Submit (Full width on bottom) */}
        <div className="md:col-span-2 pt-8 text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-sky-500 text-white px-6 py-3 text-sm font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-sky-600 transition duration-200"
          >
            {loading ? "Saving..." : "Update Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminContactSettings;
