// components/ReviewForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

const ReviewForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    console.log("User state:", user); // Debug user object

    const checkReviewEligibility = async () => {
      try {
        console.log("Checking review eligibility for productId:", productId);
        const response = await axios.get(`/api/reviews/can-review/${productId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log("Eligibility response:", response.data);
        setCanReview(response.data.canReview);
        setIsLoading(false);
        if (!response.data.canReview) {
          toast.error(response.data.reason || "Cannot review this product");
          navigate("/orders");
        }
      } catch (error) {
        console.error("Eligibility check error:", error.response?.data || error);
        toast.error(error.response?.data?.message || "Failed to check review eligibility");
        setIsLoading(false);
        navigate("/orders");
      }
    };

    const fetchProduct = async () => {
      try {
        console.log("Fetching product for productId:", productId);
        const response = await axios.get(`/api/products/${productId}`);
        console.log("Product response:", response.data);
        setProduct(response.data);
      } catch (error) {
        console.error("Product fetch error:", error.response?.data || error);
        toast.error("Failed to fetch product details");
      }
    };

    if (user?.token) {
      checkReviewEligibility();
      fetchProduct();
    } else {
      console.error("No user token found");
      toast.error("Please log in to write a review");
      setIsLoading(false);
      navigate("/login");
    }
  }, [productId, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("comment", comment);
      if (image) formData.append("image", image);

      console.log("Submitting review for productId:", productId);
      await axios.post(`/api/reviews/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Review submitted successfully");
      navigate("/orders");
    } catch (error) {
      console.error("Review submission error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (!canReview) return null;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4">
        Write a Review for {product?.name || "Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rating (1-5)
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="mt-1 block w-full border rounded-md p-2"
            required
          >
            <option value={0} disabled>Select rating</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} Star{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="mt-1 block w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-sky-600 hover:bg-sky-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;