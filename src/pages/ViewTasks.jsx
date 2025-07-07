import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    taskId: null,
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  //   const fetchTasks = async () => {
  //     try {
  //       const res = await fetch(
  //         `${import.meta.env.VITE_BACKEND_URL}/api/tasks/user/${userInfo.email}`
  //       );
  //       const data = await res.json();
  //       setTasks(data);
  //     } catch (err) {
  //       toast.error("Failed to fetch tasks");
  //     }
  //   };

  const fetchTasks = async () => {
    try {
      const endpoint =
        userInfo?.role === "admin"
          ? `${import.meta.env.VITE_BACKEND_URL}/api/tasks`
          : `${import.meta.env.VITE_BACKEND_URL}/api/tasks/user/${
              userInfo.email
            }`;

      const res = await fetch(endpoint);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    // if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });
      toast.success("Task deleted");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "working" ? "completed" : "working";
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success("Status updated");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const startEdit = (task) => {
    setEditingTaskId(task._id);
    setEditForm({ title: task.title, description: task.description });
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditForm({ title: "", description: "" });
  };

  const saveEdit = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      toast.success("Task updated");
      cancelEdit();
      fetchTasks();
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Tasks</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks found.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="p-4 bg-white shadow rounded-md border border-gray-100"
            >
              {editingTaskId === task._id ? (
                <>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full mb-2 px-3 py-2 border rounded-md"
                  />
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full mb-2 px-3 py-2 border rounded-md"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(task._id)}
                      className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-300 text-gray-800 px-4 py-1.5 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-gray-600 mb-2">{task.description}</p>
                  {userInfo?.role === "admin" && (
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-semibold">User:</span> {task.name} 
                      <br />
                      <span className="font-semibold">Email:</span> {task.email} 
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mb-2">
                    Created At: {new Date(task.createdAt).toLocaleString()}
                  </p>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          task.status === "completed"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {task.status}
                      </span>
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleStatusToggle(task._id, task.status)
                        }
                        className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                      >
                        Mark as{" "}
                        {task.status === "working" ? "Completed" : "Working"}
                      </button>
                      <button
                        onClick={() => startEdit(task)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setConfirmModal({ isOpen: true, taskId: task._id })
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {confirmModal.isOpen && (
                    <div
                      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
                      onClick={() =>
                        setConfirmModal({ isOpen: false, taskId: null })
                      }
                    >
                      <div
                        className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-lg font-semibold mb-2 text-red-600">
                          Confirm Delete
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Are you sure you want to delete this task?
                        </p>
                        <div className="flex justify-end gap-2">
                          <button
                            className="px-4 py-1 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                            onClick={() =>
                              setConfirmModal({ isOpen: false, taskId: null })
                            }
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                            onClick={() => {
                              handleDelete(confirmModal.taskId);
                              setConfirmModal({ isOpen: false, taskId: null });
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewTasks;
