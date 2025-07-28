import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineUser, HiChevronDown } from "react-icons/hi";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { IoIosClose } from "react-icons/io";
import logo from "../../assets/logo1.png";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import axios from "axios";
import { GiTreasureMap } from "react-icons/gi"; // example icon
import useSmartLoader from "../../hooks/useSmartLoader";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dropdownRef = useRef();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, data: contactInfo } = useSmartLoader(async () => {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/settings/contact`);
  return res.data;
});

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setProfileOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

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
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img src={logo} alt="Logo" className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {["/collections/all", "/about", "/contact-us", "/privacy-policy"].map((path, index) => (
            <Link
              key={path}
              to={path}
              className={`text-sm font-semibold tracking-wide transition-all duration-300 ease-in-out uppercase ${
                isActive(path)
                  ? "text-sky-600 border-b-2 border-sky-600 pb-1"
                  : "text-gray-600 hover:text-black hover:border-b-2 hover:border-gray-300 pb-1"
              }`}
            >
              {["Collections", "About", "Contact Us", "Privacy & Policy"][index]}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {user &&
            (user.role === "admin" ||
              user.role === "merchantise" ||
              user.role === "delivery_boy") && (
              <Link
                to={user.role === "delivery_boy" ? "/admin/orders" : "/admin"}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-full shadow hover:shadow-md hover:from-sky-600 hover:to-blue-700 transition-all duration-300"
              >
                {user.role === "admin"
                  ? "Admin Panel"
                  : user.role === "merchantise"
                  ? "Merchandise Panel"
                  : "Delivery Panel"}
              </Link>
            )}

          {user ? (
            user.role === "customer" && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-all"
                >
                  <HiOutlineUser className="h-6 w-6 text-sky-600" />
                  <span className="text-sm font-medium text-gray-800 hidden md:inline">
                    {user.name}
                  </span>
                  <HiChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
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
                        dispatch(logout());
                        navigate("/login");
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
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-full shadow hover:from-sky-600 hover:to-blue-700 transition duration-300"
            >
              Login
            </Link>
          )}

          <button onClick={toggleCartDrawer} className="relative hover:scale-105 transition-transform">
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-sky-500 text-white text-xs rounded-full px-2 py-0.5 shadow">
                {cartItemCount}
              </span>
            )}
          </button>

          <div className="overflow-hidden">
            <SearchBar />
          </div>

          <button onClick={toggleNavDrawer} className="md:hidden transition-transform hover:scale-110">
            <HiMiniBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-xl transform transition-transform duration-300 z-50 ${
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
            {[
              { path: "/", label: "Home" },
              { path: "/collections/all", label: "Collections" },
              { path: "/about", label: "About Us" },
              { path: "/contact-us", label: "Contact Us" },
              { path: "/privacy-policy", label: "Privacy & Policy" },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={toggleNavDrawer}
                className="block text-gray-700 hover:text-sky-600 text-base font-semibold uppercase tracking-wide transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-4 absolute bottom-0 pb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Follow Us</h3>
            <div className="flex space-x-4 mb-4">
              {contactInfo?.showFacebook && (
              <a
                href={contactInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TbBrandMeta className="h-5 w-5 text-blue-600 inline" />
              </a>
              )}
              {contactInfo?.showInstagram && (
              <a
                href={contactInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoInstagram className="h-5 w-5 inline text-[#E1306C]" />
              </a>
              )}
            </div>
            
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Contact</h3>
            {contactInfo?.showGmail && (
              <a href={`mailto:${contactInfo.gmail}`} className="text-xs text-gray-600">{contactInfo.gmail}</a>
            )}
            {contactInfo?.showPhone && (
              <a href={`tel:${contactInfo.phone}`} className="text-xs text-gray-600">{contactInfo.phone}</a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
