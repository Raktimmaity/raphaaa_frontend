import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import menImg from "../../assets/mens-collection.jpg";
import womenImg from "../../assets/womens-collection.jpg";
import product1 from "../../assets/product1.webp";
import product2 from "../../assets/product2.webp";
import useSmartLoader from "../../hooks/useSmartLoader";

const GenderCollectionSection = () => {
  const { loading } = useSmartLoader(async () => {
    await new Promise((res) => setTimeout(res, 300));
    return true;
  });

  if (loading) {
    return (
      <section className="py-16 px-4 lg:px-0 bg-gray-50">
        <div className="container mx-auto flex flex-col md:flex-row gap-8">
          {/* Skeleton Card */}
          {[1, 2].map((_, i) => (
            <div
              key={i}
              className="flex-1 animate-pulse bg-gray-200 rounded-xl h-[500px] md:h-[600px] lg:h-[700px]"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 lg:px-0 bg-gray-50">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Women's Collection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative flex-1 group overflow-hidden rounded-xl shadow-lg"
        >
          <img
            src={product1}
            alt="Women-collection-img"
            width={1000}
            height={700}
            className="w-full h-[500px] md:h-[600px] lg:h-[700px] object-cover transition-transform duration-500 group-hover:scale-105 rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
          <div className="absolute bottom-8 left-8 z-10 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className="inline-block px-5 py-2 bg-white text-black font-medium rounded hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
          </div>
        </motion.div>

        {/* Men's Collection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative flex-1 group overflow-hidden rounded-xl shadow-lg"
        >
          <img
            src={product2}
            alt="Men-collection-img"
            width={1000}
            height={700}
            className="w-full h-[500px] md:h-[600px] lg:h-[800px] object-cover transition-transform duration-500 group-hover:scale-105 rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
          <div className="absolute bottom-8 left-8 z-10 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=Men"
              className="inline-block px-5 py-2 bg-white text-black font-medium rounded hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
