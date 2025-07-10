import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineUser } from "react-icons/hi";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { IoIosClose } from "react-icons/io";
import logo from "../../assets/logo1.png";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io5";
import { RiTwitterXLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { HiChevronDown } from "react-icons/hi";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dropdownRef = useRef();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setProfileOpen(false);
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // simulate loading
    return () => clearTimeout(timer);
  }, []);

  const isActive = (path) => location.pathname === path;

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (loading) {
    return (
      <div className="w-full px-6 py-4">
        <div className="container mx-auto flex items-center justify-between animate-pulse">
          <div className="h-10 w-24 bg-gray-200 rounded" />
          <div className="hidden md:flex space-x-6">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-6 w-6 bg-gray-200 rounded-full" />
            <div className="h-6 w-6 bg-gray-200 rounded-full" />
            <div className="h-6 w-6 bg-gray-200 rounded-full" />
            <div className="h-6 w-6 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left logo */}
        <div>
          <Link to="/" className="text-2xl font-medium no-underline">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Center navigation links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all"
            className={`text-sm font-extrabold uppercase ${
              isActive("/collections/all")
                ? "bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent underline"
                : "text-gray-700 hover:text-black"
            }`}
          >
            Collections
          </Link>
          <Link
            to="/about"
            className={`text-sm font-extrabold uppercase ${
              isActive("/about")
                ? "bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent underline"
                : "text-gray-700 hover:text-black"
            }`}
          >
            About
          </Link>
          <Link
            to="/contact-us"
            className={`text-sm font-extrabold uppercase ${
              isActive("/contact-us")
                ? "bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent underline"
                : "text-gray-700 hover:text-black"
            }`}
          >
            CONTACT US
          </Link>
          <Link
            to="/privacy-policy"
            className={`text-sm font-extrabold uppercase ${
              isActive("/privacy-policy")
                ? "bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent underline"
                : "text-gray-700 hover:text-black"
            }`}
          >
            Privacy & Policy
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-4">
          {user &&
            (user.role === "admin" ||
              user.role === "merchantise" ||
              user.role === "delivery_boy") && (
              <Link
                to={user.role === "delivery_boy" ? "/admin/orders" : "/admin"}
                className="block bg-gradient-to-r from-sky-500 to-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow hover:from-sky-600 hover:to-blue-700 transition-all duration-300"
              >
                {user.role === "admin"
                  ? "Admin Panel"
                  : user.role === "merchantise"
                  ? "Merchandise Panel"
                  : user.role === "delivery_boy"
                  ? "Delivery Panel"
                  : "User Panel"}
              </Link>
            )}
          {user ? (
            user.role === "customer" && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white transition duration-200"
                >
                  <HiOutlineUser className="h-6 w-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full p-1" />
                  <span className="text-sm font-medium text-gray-700 hidden md:inline">
                    {user.name}
                  </span>
                  <HiChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Profile
                    </Link>
                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem("userInfo");
                        window.location.href = "/login";
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow hover:from-sky-600 hover:to-blue-700 transition-all duration-300"
            >
              {/* <HiOutlineUser className="h-6 w-6 text-gray-700" /> */}
              Login
            </Link>
          )}

          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 bg-sky-500 text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>

          <div className="overflow-hidden">
            <SearchBar />
          </div>
          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiMiniBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Navgation */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleNavDrawer}
            className="text-gray-600 hover:text-gray-800"
          >
            <IoIosClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              to="/"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              Home
            </Link>
            <Link
              to="/collections/all"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              Collections
            </Link>
            <Link
              to="/about"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              About Us
            </Link>
            <Link
              to="/contact-us"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              Contact Us
            </Link>
            <Link
              to="privacy-policy"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              Privacy & Policy
            </Link>
          </nav>

          <div className="mt-8 pt-4 absolute bottom-0 pb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Follow Us
            </h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.facebook.com/Raphaaa.Store/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TbBrandMeta className="h-5 w-5 text-blue-600 inline" />
              </a>
              <a
                href="https://www.instagram.com/raphaaaofficial/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoInstagram className="h-5 w-5 inline text-[#E1306C]" />
              </a>
              {/* <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiTwitterXLine className="h-4 w-4 inline" />
              </a> */}
            </div>

            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              Contact
            </h3>
            <p className="text-xs text-gray-600">support@raphaa.com</p>
            <p className="text-xs text-gray-600">+91 98765 43210</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
