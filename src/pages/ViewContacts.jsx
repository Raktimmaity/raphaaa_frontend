import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { FaTrashAlt, FaReply } from "react-icons/fa";

const ViewContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState({ subject: "", message: "" });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 5;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contact`);
        setContacts(res.data);
      } catch (error) {
        toast.error("Failed to load contact messages");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/contact/${id}`);
      setContacts((prev) => prev.filter((msg) => msg._id !== id));
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const filteredContacts = contacts.filter(
    (msg) =>
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredContacts.length / messagesPerPage);
  const displayedContacts = filteredContacts.slice(
    (currentPage - 1) * messagesPerPage,
    currentPage * messagesPerPage
  );

  const openReply = (msg) => {
    setReplyTo(msg);
    setReplyContent({ subject: `Re: ${msg.subject}`, message: "" });
    setShowReplyForm(true);
  };

 const handleReplySubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contact/reply`, {
      to: replyTo.email,
      subject: replyContent.subject,
      message: replyContent.message,
    });
    toast.success(`Email sent to ${replyTo.email}`);
    setShowReplyForm(false);
  } catch (err) {
    toast.error("Failed to send reply email");
  }
};

  return (
    <div className="p-4">
      <Toaster richColors position="top-right" />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📨 Contact Messages</h2>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="mb-4 w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
      />

      {loading ? (
        <p className="text-center text-gray-500">Loading messages...</p>
      ) : displayedContacts.length === 0 ? (
        <p className="text-center text-gray-400">No messages found.</p>
      ) : (
        <div className="grid gap-4">
          {displayedContacts.map((msg) => (
            <div
              key={msg._id}
              className="bg-gradient-to-br from-white to-sky-50 border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-sky-800 mb-1">{msg.subject}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDeleteId(msg._id)}
                    className="text-red-600 hover:text-red-800 text-sm p-2 rounded-full hover:bg-red-100"
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    onClick={() => openReply(msg)}
                    className="text-sky-600 hover:text-sky-800 text-sm p-2 rounded-full hover:bg-sky-100"
                    title="Reply"
                  >
                    <FaReply />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-1">
                <strong>Name:</strong> {msg.name}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Email:</strong> {msg.email}
              </p>
              <p className="text-gray-800 mt-2 text-sm leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                currentPage === i + 1
                  ? "bg-sky-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Are you sure?</h3>
            <p className="text-sm text-gray-600 mb-6">This will permanently delete the message.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showReplyForm && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reply to {replyTo.email}</h3>
            <form onSubmit={handleReplySubmit} className="space-y-4">
              <input
                type="text"
                // value={replyContent.subject}
                onChange={(e) => setReplyContent({ ...replyContent, subject: e.target.value })}
                placeholder="Subject"
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
              <textarea
                rows="4"
                value={replyContent.message}
                onChange={(e) => setReplyContent({ ...replyContent, message: e.target.value })}
                placeholder="Your message"
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 text-sm"
                >
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewContacts;
