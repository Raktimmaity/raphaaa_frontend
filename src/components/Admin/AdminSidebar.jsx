import React, { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaClipboardList,
  FaShoppingBag,
  FaSignOutAlt,
  FaStore,
  FaUser,
} from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { useSelector } from "react-redux";
import icon from "../../assets/man.png";
import { HiPlusCircle } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/" className="text-2xl font-medium">
          Raphaaa
        </Link>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-medium mb-4">Admin Dashboard</h2>

        {user && (
          <div className="flex items-center justify-center gap-4 bg-gray-800 p-3 rounded-lg">
            <img
              src={icon}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
            <div className="text-left text-sm text-gray-200">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
              <p
                className={`text-xs ${
                  isOnline ? "text-green-400" : "text-red-400"
                }`}
              >
                ● {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        )}
      </div>

      <nav className="flex flex-col space-y-2">
        {/* Dashboard - Visible to all */}
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <RiDashboardHorizontalFill />
          <span>Dashboard</span>
        </NavLink>

        {/* Only for admin */}
        {user?.role === "admin" && (
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaUser />
            <span>Users</span>
          </NavLink>
        )}

        {/* Visible to both admin and merchantise */}
        {(user?.role === "admin" || user?.role === "merchantise") && (
          <>
            <NavLink
              to="/admin/add-product"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
              }
            >
              <HiPlusCircle className="text-lg" />
              <span>Add Products</span>
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
              }
            >
              <FaBoxOpen />
              <span>Products</span>
            </NavLink>
          </>
        )}

        {/* Only for admin */}
        {user?.role === "admin" && (
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaClipboardList />
            <span>Orders</span>
          </NavLink>
        )}

        {/* Shop Link - Visible to all */}
        <NavLink
          to="update-profile"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <CgProfile />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
