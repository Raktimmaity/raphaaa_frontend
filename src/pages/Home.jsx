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

  useEffect(() => {
    let timerInterval;
    if (activeOffer && new Date() < new Date(activeOffer.startDate)) {
      const start = new Date(activeOffer.startDate).getTime();

      timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = start - now;

        if (distance <= 0) {
          document.getElementById("offer-timer").innerText = "Now Live!";
          clearInterval(timerInterval);
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (distance % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("offer-timer").innerText =
          `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [activeOffer]);
  useEffect(() => {
    const lastSeen = localStorage.getItem("seenOfferBanner");
    const today = new Date().toISOString().slice(0, 10);
    if (lastSeen !== today) {
      setShowAlert(true);
      localStorage.setItem("seenOfferBanner", today);
    }
  }, []);

  const popupStyle = `
  @keyframes scaleIn {
    0% { transform: scale(0.6); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .animate-popup {
    animation: scaleIn 0.4s ease-out;
  }
`;
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = popupStyle;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);
// useEffect(() => {
//   // Delay alert appearance by 6 seconds
//   const delay = setTimeout(() => {
//     setShowAlert(true);
//   }, 6000);
//   return () => clearTimeout(delay);
// }, []);

useEffect(() => {
  let timer;
  if (activeOffer && new Date() < new Date(activeOffer.startDate)) {
    const start = new Date(activeOffer.startDate).getTime();
    timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = start - now;

      if (distance <= 0) {
        const el = document.getElementById("alert-offer-timer");
        if (el) el.innerText = "Now Live!";
        clearInterval(timer);
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      const el = document.getElementById("alert-offer-timer");
      if (el) el.innerText = `${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
  }

  return () => clearInterval(timer);
}, [activeOffer]);



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
        <div className="relative w-full mb-8">
          {/* Full Width Banner */}
          {activeOffer.bannerImage && (
            <img
              src={activeOffer.bannerImage}
              alt={activeOffer.title}
              className="w-full h-[220px] md:h-[420px] object-cover"
            />
          )}

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-6 bg-black/40 text-white">
            <div
              className="flex-1 mix-blend-screen"
              style={{
                textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
              }}
            >
              <h2 className="text-2xl md:text-4xl font-extrabold mb-2 uppercase">
                {activeOffer.title}
              </h2>
              <p className="text-sm md:text-lg font-medium">
                Save up to{" "}
                <span className="bg-red-500 font-bold text-xl text-white px-5 py-1">
                  {activeOffer.offerPercentage}% OFF
                </span>{" "}
                from{" "}
                <span className="font-semibold text-amber-200">
                  {activeOffer.startDate.slice(0, 10)}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-amber-200">
                  {activeOffer.endDate.slice(0, 10)}
                </span>
              </p>

              {/* Countdown Timer (only before start) */}
              {new Date() < new Date(activeOffer.startDate) && (
                <div className="mt-3 inline-block bg-amber-600 text-white px-4 py-1 rounded-full text-xs md:text-sm font-semibold tracking-wider">
                  Starts in: <span id="offer-timer" className="ml-1" />
                </div>
              )}
            </div>

            {/* View Offers Button: Only when offer is active */}
            {new Date() >= new Date(activeOffer.startDate) && (
              <Link
                to="/offers"
                className="mt-6 md:mt-0 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg text-sm font-bold shadow-lg transition duration-200"
              >
                View Offers
              </Link>
            )}
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

      {activeOffer && showAlert && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
    <div className="relative bg-orange-100 border border-orange-300 shadow-lg rounded-lg overflow-hidden animate-popup p-4 max-w-xs md:max-w-sm w-full text-center">
      <img
        src={activeOffer.alertImage}
        alt={activeOffer.title}
        className="w-auto max-w-full max-h-[70vh] object-contain mx-auto mb-4"
      />

      {/* Countdown Timer OR Shop Now */}
      {new Date() < new Date(activeOffer.startDate) ? (
        <div className="bg-amber-600 text-white px-4 py-2 rounded-full font-semibold text-sm inline-block mb-2">
          Offer starts in: <span id="alert-offer-timer" className="ml-1" />
        </div>
      ) : (
        <Link
          to="/offers"
          onClick={() => setShowAlert(false)}
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full font-semibold text-sm transition mb-2"
        >
          🛍 Shop Now
        </Link>
      )}

      {/* Close Button */}
      <button
        onClick={() => setShowAlert(false)}
        className="absolute top-2 right-2 text-orange-800 hover:text-red-500 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm"
        title="Close"
      >
        ×
      </button>
    </div>
  </div>
)}



    </div>
  );
};

export default Home;
