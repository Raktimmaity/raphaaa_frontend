import React from "react";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import product1 from "../assets/product1.jpg";
import product2 from "../assets/product2.jpg";
import product3 from "../assets/product3.jpg";
import product4 from "../assets/product4.jpg";
import product5 from "../assets/product5.jpg";
import product6 from "../assets/product6.jpg";

const placeholderProducts = [
  {
    _id: 1,
    name: "Product 1",
    price: 100,
    // images: [{ url: "https://picsum.photos/500/500?random=3" }],
    images: [{ url: product1 }],
  },
  {
    _id: 2,
    name: "Product 2",
    price: 100,
    // images: [{ url: "https://picsum.photos/500/500?random=4" }],
    images: [{ url: product2 }],
  },
  {
    _id: 3,
    name: "Product 3",
    price: 100,
    // images: [{ url: "https://picsum.photos/500/500?random=5" }],
    images: [{ url: product3 }],
  },
  {
    _id: 4,
    name: "Product 4",
    price: 100,
    // images: [{ url: "https://picsum.photos/500/500?random=6" }],
    images: [{ url: product4 }],
  },
  {
    _id: 5,
    name: "Product 5",
    price: 100,
    // images: [{ url: "https://picsum.photos/500/500?random=7" }],
    images: [{ url: product5 }],
  },
  {
    _id: 6,
    name: "Product 6",
    price: 100,
    // images: [{ url: "https://picsum.photos/500/500?random=8" }],
    images: [{ url: product6 }],
  },
  {
    _id: 7,
    name: "Product 7",
    price: 100,
    // images: [{ url: "https://picsum.photos/500/500?random=9" }],
    images: [{ url: product1 }],
  },
  {
    _id: 8,
    name: "Product 8",
    price: 100,
    // images: [{ url: "https://picsum.photos/500/500?random=10" }],
    images: [{ url: product2 }],
  },
];

const Home = () => {
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

      {/* Product details */}
      <ProductDetails />

      {/* Top wears for women */}
      <div className="container mx-auto">
        <div className="text-center mb-8 pt-8">
          <h2 className="text-3xl font-bold inline-block relative">
            Top Wears for Women
            <div className="mt-2 h-1 w-28 mx-auto bg-gradient-to-r from-blue-500 to-sky-200 rounded-full" />
          </h2>
        </div>

        {/* Products */}
        <ProductGrid products={placeholderProducts} />
      </div>

      {/* Feature collections */}
      <FeaturedCollection />
    </div>
  );
};

export default Home;
