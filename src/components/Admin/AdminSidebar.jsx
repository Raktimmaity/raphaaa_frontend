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
import { MdOutlineAddTask } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaRupeeSign } from "react-icons/fa";

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
        {/* <h2 className="text-xl font-medium mb-4">{user.role === "admin"
                  ? "Admin"
                  : user.role === "merchantise"
                  ? "Merchantise"
                  : "Customer"} Dashboard</h2> */}

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
        {(user?.role === "admin" || user?.role === "merchantise") && (
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
        )}

        {user?.role === "merchantise" && (
          <div className="text-gray-300">
            <details className="group">
              <summary className="flex items-center justify-between py-3 px-4 rounded hover:bg-gray-700 hover:text-white cursor-pointer">
                <span className="flex items-center gap-2">
                  <FaTasks className="text-lg" />
                  <span>Task</span>
                </span>
                <svg
                  className="w-4 h-4 ml-1 group-open:rotate-90 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </summary>
              <div className="ml-6 mt-1 space-y-1">
                <NavLink
                  to="/admin/add-task"
                  className={({ isActive }) =>
                    isActive
                      ? "block bg-gray-700 text-white px-3 py-2 rounded-md"
                      : "block hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md"
                  }
                >
                  Add Task
                </NavLink>
                <NavLink
                  to="/admin/view-tasks"
                  className={({ isActive }) =>
                    isActive
                      ? "block bg-gray-700 text-white px-3 py-2 rounded-md"
                      : "block hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md"
                  }
                >
                  View My Tasks
                </NavLink>
              </div>
            </details>
          </div>
        )}

        {/* Only for admin */}
        {user?.role === "admin" && (
          <NavLink
            to="/admin/all-tasks"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaTasks />
            <span>All Tasks</span>
          </NavLink>
        )}

        {(user?.role === "admin" || user?.role === "merchantise") && (
          <NavLink
            to="/admin/inventory"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaBoxOpen />
            <span>Inventory</span>
          </NavLink>
        )}
        {(user?.role === "admin" || user?.role === "merchantise") && (
          <NavLink
            to="/admin/trend-analysis"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <BsGraphUpArrow />
            <span>Sales Analysis</span>
          </NavLink>
        )}
        {(user?.role === "admin" || user?.role === "merchantise") && (
          <NavLink
            to="/admin/revenue"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaRupeeSign />
            <span>Total Revenue</span>
          </NavLink>
        )}

        {(user?.role === "admin" || user?.role === "merchantise") && (
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
        {(user?.role === "admin" || user?.role === "merchantise" || user?.role === "delivery_boy") && (
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
