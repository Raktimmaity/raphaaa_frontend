import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../../redux/slices/adminSlice";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiFileExcel2Line } from "react-icons/ri";

// toast.configure();

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "merchantise") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addUser(formData));

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
  };

  const handleRoleChange = (userId, newRole) => {
    const userToUpdate = users.find((u) => u._id === userId);
    if (userToUpdate && userToUpdate.role !== newRole) {
      if (
        window.confirm(
          `Are you sure you want to change ${userToUpdate.name}'s role to ${newRole}?`
        )
      ) {
        dispatch(
          updateUser({
            id: userId,
            name: userToUpdate.name,
            email: userToUpdate.email,
            role: newRole,
          })
        );
        toast.success(`${userToUpdate.name}'s role updated to ${newRole}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      }
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  const exportToExcel = () => {
    const data = filteredUsers.map(({ name, email, role, createdAt }) => ({
      Name: name,
      Email: email,
      Role: role,
      CreatedAt: new Date(createdAt).toLocaleString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "Users.xlsx");
  };

  // const filteredUsers = users.filter(
  //   (u) =>
  //     u.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //     (roleFilter ? u.role === roleFilter : true)
  // );

  const filteredUsers = users
    .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((u) => {
      // Admin can see all
      if (user?.role === "admin") return true;

      // Merchantise can see only customer & delivery_boy
      if (user?.role === "merchantise") {
        return u.role === "customer" || u.role === "delivery_boy";
      }

      return false;
    })
    .filter((u) => (roleFilter ? u.role === roleFilter : true));

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4"> User Management</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Add new user form */}
      {/* ... unchanged add user form ... */}
      <div className="p-6 bg-white shadow-md rounded-lg mb-6">
        <h3 className="text-lg font-bold mb-6">Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 mb-1 font-medium"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 mb-1 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 mb-1 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-gray-700 mb-1 font-medium"
              >
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {user?.role === "admin" && (
                  <>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="merchantise">Merchantise</option>
                    <option value="delivery_boy">Delivery Boy</option>
                  </>
                )}

                {user?.role === "merchantise" && (
                  <>
                    <option value="">Select Role</option>
                    <option value="delivery_boy">Delivery Boy</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>

      {/* user list management */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h3 className="text-lg font-bold mb-6">Manage Existing Users</h3>
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-3/5 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="md:w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="delivery_boy">Delivery Boy</option>
          </select>
          <button
            onClick={exportToExcel}
            className="w-1/2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <RiFileExcel2Line className="inline" size={26} /> Export to Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Change Role</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                      {u.name}
                    </td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full text-white w-fit ${
                            u.role === "admin"
                              ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                              : u.role === "merchantise"
                              ? "bg-gradient-to-r from-orange-400 to-pink-500"
                              : u.role === "delivery_boy"
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                              : "bg-gradient-to-r from-green-400 to-blue-400"
                          }`}
                        >
                          {u.role.charAt(0).toUpperCase() +
                            u.role.slice(1).replace("_", " ")}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u._id, e.target.value)
                        }
                        className="p-1 border text-xs rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                        disabled={loading}
                      >
                        <option value="customer">Customer</option>
                        {user?.role === "admin" && (
                          <>
                            <option value="admin">Admin</option>
                            <option value="merchantise">Merchantise</option>
                            <option value="delivery_boy">Delivery Boy</option>
                          </>
                        )}
                        {user?.role === "merchantise" && (
                          <option value="delivery_boy">Delivery Boy</option>
                        )}
                      </select>
                    </td>
                    <td className="p-4">
                      {new Date(u.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      {u._id !== user._id && (
                        <>
                          {(user?.role === "admin" ||
                            (user?.role === "merchantise" &&
                              u.role === "delivery_boy")) && (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                              disabled={loading}
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md border ${
                  page === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                } hover:bg-blue-100`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
