import React from "react";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";

const placeholderProducts = [
  {
    _id: 1,
    name: "Product 1",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=3" }],
  },
  {
    _id: 2,
    name: "Product 2",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=4" }],
  },
  {
    _id: 3,
    name: "Product 3",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=5" }],
  },
  {
    _id: 4,
    name: "Product 4",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=6" }],
  },
  {
    _id: 5,
    name: "Product 5",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=7" }],
  },
  {
    _id: 6,
    name: "Product 6",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=8" }],
  },
  {
    _id: 7,
    name: "Product 7",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=9" }],
  },
  {
    _id: 8,
    name: "Product 8",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=10" }],
  },
];

const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      {/* Best Sellers */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold inline-block relative">
          Best Seller
          <div className="mt-2 h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-blue-200 rounded-full" />
        </h2>
      </div>

      <ProductDetails />

      <div className="container mx-auto">
        <div className="text-center mb-8 pt-4">
          <h2 className="text-3xl font-bold inline-block relative">
            Top Wears for Women
            <div className="mt-2 h-1 w-28 mx-auto bg-gradient-to-r from-blue-500 to-sky-200 rounded-full" />
          </h2>
        </div>

        <ProductGrid products={placeholderProducts} />
      </div>
      <FeaturedCollection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
