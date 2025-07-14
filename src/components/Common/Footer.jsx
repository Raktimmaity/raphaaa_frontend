import React, { useState, useEffect } from "react";
import { IoCall, IoLogoInstagram } from "react-icons/io5";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta, TbFilePhone } from "react-icons/tb";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // or use "sonner"
import Logo from "../../assets/logo1.png";
import visa from "../../assets/visa.png";
import mastercard from "../../assets/mastercard.png";
import upi from "../../assets/upi.png";
import cod from "../../assets/cod.png";
import free_shipping from "../../assets/free_shipping.png";
import easy_return from "../../assets/easy return.png";
import { FaChevronUp } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

const Footer = () => {
  const [subscribe, setSubscribe] = useState("");
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscribe.trim()) {
      return toast.error("Please enter a valid email.");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscribe`,
        { email: subscribe },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Subscribed successfully!");
      setSubscribe("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Subscription failed. Try again later."
      );
    } finally {
      setLoading(false);
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
    <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-4 lg:px-0">
        {/* Newsletter + Logo */}
        <div>
          <img src={Logo} alt="Raphaaa Logo" className="w-24 md:w-40 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Newsletter
          </h3>
          <p className="text-gray-600 mb-2">
            Be the first to hear about new products, exclusive events and online
            offers.
          </p>
          <p className="font-medium text-sm text-gray-500 mb-4">
            Sign up and get{" "}
            <span className="text-blue-600 font-semibold">10% off</span> your
            first order.
          </p>
          <form className="flex" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full text-sm border border-gray-300 bg-white rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={subscribe}
              onChange={(e) => setSubscribe(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-sky-500 text-white px-5 py-3 text-sm font-medium rounded-r-lg hover:from-blue-700 hover:to-sky-600 transition-all"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li>
              <Link
                to="/collections/all?category=Top+Wear&gender=Men"
                className="hover:text-blue-600 transition-colors"
              >
                Men's Top Wear
              </Link>
            </li>
            <li>
              <Link
                to="/collections/all?category=Top+Wear&gender=Women"
                className="hover:text-blue-600 transition-colors"
              >
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link
                to="/collections/all?category=Bottom+Wear&gender=Men"
                className="hover:text-blue-600 transition-colors"
              >
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link
                to="/collections/all?category=Bottom+Wear&gender=Women"
                className="hover:text-blue-600 transition-colors"
              >
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Support</h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li>
              <Link
                to="/collections/all"
                className="hover:text-blue-600 transition-colors"
              >
                All Collections
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-blue-600 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact-us"
                className="hover:text-blue-600 transition-colors"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-blue-600 transition-colors"
              >
                Privacy & Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Follow Us
          </h3>
          <div className="flex items-center space-x-4 mb-5">
            {contactInfo?.showFacebook && (
            <a
              href={contactInfo.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-all"
            >
              <FaFacebook className="h-5 w-5" />
            </a>
            )}
            {contactInfo?.showInstagram && (
            <a
              href={contactInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition-all"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            )}
          </div>
          <p className="text-gray-600 font-medium text-sm mb-1">Call Us</p>
          {contactInfo?.showPhone && (
          <p className="text-gray-800 text-sm">
            <IoCall className="inline-block mr-2" />
            {contactInfo.phone}
          </p>
          )}
        </div>
      </div>

      <hr className="border-gray-200 mt-10" />

      {/* Trust Badges / Payment Icons */}
      <div className="container mx-auto mt-8 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-4 text-gray-500 text-xs">
          <span className="uppercase tracking-widest">We Accept</span>
          <img src={visa} alt="Visa" className="h-5" />
          <img src={mastercard} alt="MasterCard" className="h-5" />
          <img src={upi} alt="UPI" className="h-5" />
        </div>
        <div className="text-xs text-gray-400">
          Trusted & Secure Payment | 100% Satisfaction Guaranteed
        </div>
      </div>

      <div className="container mx-auto mt-4 flex flex-wrap justify-center md:justify-between items-center text-gray-600 text-xs px-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <img src={cod} alt="COD" className="h-4 md:h-10" />
            COD Available
          </span>
          <span className="flex items-center gap-2">
            <img
              src={free_shipping}
              alt="Free Shipping"
              className="h-4 md:h-10"
            />
            Free Shipping
          </span>
          <span className="flex items-center gap-2">
            <img src={easy_return} alt="Easy Returns" className="h-4 md:h-10" />
            Easy 7-Day Returns
          </span>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto mt-6 px-4 lg:px-0 pt-4">
        <p className="text-center text-gray-500 text-sm">
          © 2025 <span className="font-medium text-gray-700">Raphaaa</span>. All
          rights reserved.
        </p>
      </div>
      {/* <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 cursor-pointer"
        title="Back to Top"
      >
        <FaChevronUp className="h-4 w-4" />
      </button> */}
    </footer>
  );
};

export default Footer;
