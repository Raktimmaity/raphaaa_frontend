import React, { useState } from 'react';
import contactImg from "../../assets/product4.jpg";
import axios from "axios";
import { toast } from "sonner";
 
const Contact = () => {

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, formData);
      toast.success("Message sent successfuly!!");
      setFormData({ name: "", email: "", subject: "", message: ""});
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left: Image */}
          <div className="h-full w-full">
            <img
              src={contactImg}
              alt="Contact Us"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right: Form & Info */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We'd love to hear from you. Whether you have a question about our products, need support,
              or just want to connect — feel free to drop a message.
            </p>

            <div className="space-y-4">
              <p className="text-gray-800 font-medium">
                📧 Email: <span className="text-blue-600">support@raphaaa.com</span>
              </p>
              <p className="text-gray-800 font-medium">
                📞 Phone: <span className="text-blue-600">+91 98765 43210</span>
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
              <textarea
                placeholder="Your Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              ></textarea>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-2 rounded-md text-white font-semibold ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700"} transition duration-200`}
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
