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

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  const [bestSellerLoading, setBestSellerLoading] = useState(true);
  const [bestSellerError, setBestSellerError] = useState(null);

  useEffect(() => {
    // fetch products for a specific collections
    dispatch(fetchProductsByFilters({
      gender: "Women",
      category: "Botton Wear",
      limit: 8,
    }));

    // fetch best seller product
    const fetchBestSeller = async () => {
      try {
        setBestSellerLoading(true);
        setBestSellerError(null);
        
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
        
        // Validate the response data
        if (response.data && response.data._id) {
          setBestSellerProduct(response.data);
        } else {
          setBestSellerError("Invalid best seller product data");
        }
      } catch (error) {
        console.error("Error fetching best seller:", error);
        setBestSellerError(error.response?.data?.message || "Failed to fetch best seller");
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

  return (
    <div>
      {/* Hero section */}
      <Hero />

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
      <BestSellersSection/>

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
      {/* <FeaturedCollection /> */}
    </div>
  );
};

export default Home;