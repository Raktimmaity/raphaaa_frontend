import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const SubmitReview = () => {
  const { orderId } = useParams(); // This should actually be productId for the review
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fix 1: Proper Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = "dqj64anbj"; // Replace with your actual cloud name
  const CLOUDINARY_UPLOAD_PRESET = "review_uploads"; // Replace with your actual preset

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (res.data && res.data.secure_url) {
        setImage(res.data.secure_url);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Invalid response from Cloudinary");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error(err.response?.data?.error?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating || !comment.trim()) {
      toast.error("Please provide both rating and comment");
      return;
    }

    if (!user || !user.token) {
      toast.error("Please login to submit review");
      return;
    }

    try {
      setSubmitting(true);
      
      // Fix 2: Use the correct endpoint - if orderId is actually productId
      // If you need to get productId from orderId, you'll need to fetch the order first
      const response = await axios.post(
        `/api/products/${orderId}/reviews`, // Assuming orderId is actually productId
        { 
          rating: Number(rating), 
          comment: comment.trim(), 
          image: image || undefined 
        },
        { 
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      toast.success("Review submitted successfully");
      navigate("/my-orders");
    } catch (err) {
      console.error("Review submission error:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Failed to submit review";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-xl border border-sky-100">
      <h2 className="text-2xl font-bold mb-6 text-sky-700">Write a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Rating *</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border rounded-md px-4 py-2 bg-white outline-sky-300"
            required
          >
            <option value="">Select rating</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 && "s"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Comment *</label>
          <textarea
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-md px-4 py-2 bg-white outline-sky-300"
            placeholder="Share your experience with this product..."
            required
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {comment.length}/500 characters
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Upload Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-sm border rounded-md px-3 py-2"
            disabled={uploading}
          />
          {uploading && (
            <p className="text-xs text-blue-600 mt-1">Uploading image...</p>
          )}
          {image && (
            <div className="mt-3">
              <img 
                src={image} 
                alt="Review preview" 
                className="w-32 h-32 object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => setImage("")}
                className="text-xs text-red-600 hover:underline mt-1"
              >
                Remove image
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading || submitting || !rating || !comment.trim()}
          className="w-full py-3 px-4 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default SubmitReview;