import React, { useState } from "react";
import { Link } from "react-router-dom";
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

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };
  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left logo */}
        <div>
          <Link to="/" className="text-2xl font-medium no-underline">
            {/* Raphaa */}
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>
        {/* Center navigation links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all"
            className="text-gray-700 hover:text-black text-sm font-extrabold uppercase"
          >
            Collections
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-sm font-extrabold uppercase"
          >
            MEN
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-sm font-extrabold uppercase"
          >
            WOMEN
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-sm font-extrabold uppercase"
          >
            Top Wear
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-sm font-extrabold uppercase"
          >
            Bottom Wear
          </Link>
        </div>
        {/* right icons */}
        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="block bg-gradient-to-r from-sky-500 to-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow hover:from-sky-600 hover:to-blue-700 transition-all duration-300"
            >
              Admin
            </Link>
          )}

          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>
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
          {/* Search icons */}
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
              to="#"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              Men
            </Link>
            <Link
              to="#"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              Women
            </Link>
            <Link
              to="#"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              Top Wear
            </Link>
            <Link
              to="#"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              Bottom Wear
            </Link>
          </nav>
          {/* Footer for mobile menu */}
          <div className="mt-8 pt-4 absolute bottom-0 pb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Follow Us
            </h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TbBrandMeta className="h-5 w-5 text-blue-600 inline" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoInstagram className="h-5 w-5 inline text-[#E1306C]" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiTwitterXLine className="h-4 w-4 inline" />
              </a>
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
