import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import axios from "axios";
import BestSellersSection from "../components/Products/BestSeller";
import CategorySection from "../components/Products/CategorySection";
import Collab from "../components/Products/Collab";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  const [bestSellerLoading, setBestSellerLoading] = useState(true);
  const [bestSellerError, setBestSellerError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [activeOffer, setActiveOffer] = useState(null);

  useEffect(() => {
    // fetch products for a specific collections
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Botton Wear",
        limit: 8,
      })
    );

    // fetch best seller product
    const fetchBestSeller = async () => {
      try {
        setBestSellerLoading(true);
        setBestSellerError(null);

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );

        // Validate the response data
        if (response.data && response.data._id) {
          setBestSellerProduct(response.data);
        } else {
          setBestSellerError("Invalid best seller product data");
        }
      } catch (error) {
        console.error("Error fetching best seller:", error);
        setBestSellerError(
          error.response?.data?.message || "Failed to fetch best seller"
        );
      } finally {
        setBestSellerLoading(false);
      }
    };

    fetchBestSeller();
  }, [dispatch]);

  // Debug logging
  useEffect(() => {
    if (bestSellerProduct) {
      console.log("Best seller product:", bestSellerProduct);
      console.log("Best seller product ID:", bestSellerProduct._id);
    }
  }, [bestSellerProduct]);

  // useEffect(() => {
  //   const lastSeen = localStorage.getItem("seenOfferAlertDate");
  //   const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  //   if (lastSeen !== today) {
  //     setShowAlert(true);
  //     localStorage.setItem("seenOfferAlertDate", today);
  //   }
  // }, []);

  useEffect(() => {
    setShowAlert(true); // show every time
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/offers/public`
        );
        const active = data.find((offer) => offer.isActive);
        if (active) setActiveOffer(active);
      } catch (err) {
        console.error("Failed to load active offer", err);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div>
      {/* Hero section */}
      {/* <Collab/> */}
      {/* {showAlert && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-xl font-bold text-blue-700 mb-2">
              🎉 Big Offer is Coming!
            </h2>
            <p className="text-gray-600 mb-4">
              Stay tuned for exciting deals during our upcoming seasonal sale!
            </p>
            <button
              onClick={() => setShowAlert(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
            >
              ×
            </button>
            <button
              onClick={() => setShowAlert(false)}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )} */}

      {activeOffer && (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-orange-300 text-orange-900 px-6 py-4 rounded-xl shadow-md mb-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Offer Banner Image */}
            {activeOffer.bannerImage && (
              <div className="w-full md:w-48 flex-shrink-0">
                <img
                  src={activeOffer.bannerImage}
                  alt={activeOffer.title}
                  className="w-full h-32 object-cover rounded-lg shadow-md border border-orange-200"
                />
              </div>
            )}

            {/* Offer Text and Button */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                🎊 {activeOffer.title} - {activeOffer.offerPercentage}% OFF!
              </h2>
              <p className="text-sm text-gray-700">
                Valid from {activeOffer.startDate.slice(0, 10)} to{" "}
                {activeOffer.endDate.slice(0, 10)}
              </p>
            </div>

            {/* Button */}
            <div>
              <Link
                to="/offers"
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition"
              >
                View Offers
              </Link>
            </div>
          </div>
        </div>
      )}

      <Hero />
      <CategorySection />

      {/* Gender collection section */}
      <GenderCollectionSection />

      {/* New arrivals section */}
      <NewArrivals />

      {/* Features section */}
      <FeaturesSection />

      {/* Best Sellers */}
      <div className="text-center mb-8 pt-8">
        <h2 className="text-3xl font-bold inline-block relative">
          Best Seller
          <div className="mt-2 h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-blue-200 rounded-full" />
        </h2>
      </div>

      {/* {bestSellerLoading ? (
        <p className="text-center">Loading Best seller product...</p>
      ) : bestSellerError ? (
        <p className="text-center text-red-500">Error: {bestSellerError}</p>
      ) : bestSellerProduct && bestSellerProduct._id ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center">No best seller product found</p>
      )} */}
      <BestSellersSection />

      {/* Top wears for women */}
      {/* <div className="container mx-auto">
        <div className="text-center mb-8 pt-8">
          <h2 className="text-3xl font-bold inline-block relative">
            Top Wears for Women
            <div className="mt-2 h-1 w-28 mx-auto bg-gradient-to-r from-blue-500 to-sky-200 rounded-full" />
          </h2>
        </div> */}

      {/* Products */}
      {/* <ProductGrid products={products} loading={loading} error={error} />
      </div> */}

      {/* Feature collections */}
      <FeaturedCollection />
    </div>
  );
};

export default Home;
