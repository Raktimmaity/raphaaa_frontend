import React, { useState, useEffect } from "react";
import contactImg from "../../assets/product4.jpg";
import axios from "axios";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/contact`,
        formData
      );
      toast.success("Message sent successfuly!!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to send message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/settings/contact`
        );
        setContactInfo(res.data);
      } catch (err) {
        console.error("Failed to load contact settings", err);
      }
    };
    fetchContactInfo();
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12">
  <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
    <div className="grid md:grid-cols-2">
      {/* Left: Image */}
      <div className="h-full w-full">
        <img
          src={contactImg}
          alt="Contact Us"
          className="h-full w-full object-cover rounded-l-3xl"
        />
      </div>

      {/* Right: Form & Info */}
      <div className="p-8 md:p-12 flex flex-col justify-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-6 leading-relaxed text-base">
          We'd love to hear from you. Whether you have a question about our
          products, need support, or just want to connect — feel free to drop a message.
        </p>

        <div className="space-y-3 text-sm md:text-base">
          <p className="text-gray-800 font-medium">
            📧 Email:{" "}
            {contactInfo?.showGmail && (
              <span className="text-blue-600">{contactInfo.gmail}</span>
            )}
          </p>

          <p className="text-gray-800 font-medium">
            📞 Phone:{" "}
            {contactInfo?.showPhone && (
              <span className="text-blue-600">{contactInfo.phone}</span>
            )}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <textarea
            placeholder="Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          ></textarea>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-2 rounded-lg text-white font-semibold ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
            } transition duration-200`}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

  );
};

export default Contact;
