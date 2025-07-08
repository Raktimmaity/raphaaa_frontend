import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";

const ReviewForm = () => {
  const { productId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("userToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.error("Rating and comment are required");
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    if (image) formData.append("image", image);

    try {
      setSubmitting(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        📝 Leave a Product Review
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <FaStar
                key={num}
                size={30}
                className={`cursor-pointer transition-colors ${
                  (hovered || rating) >= num
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(num)}
                onMouseEnter={() => setHovered(num)}
                onMouseLeave={() => setHovered(null)}
                title={`${num} Star${num > 1 ? "s" : ""}`}
              />
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Image Upload + Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivered Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImage(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
          />
          {preview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="max-h-52 rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 ${
            submitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
