import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductGrid from "../components/Products/ProductGrid";
import axios from "axios";
import { toast } from "sonner";

const DropDetail = () => {
  const { slug } = useParams();
  const [footballerData, setFootballerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDropData = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/collabs/footballer/${slug}`
        );
        setFootballerData(data);
      } catch (err) {
        toast.error("Drop not found or unpublished");
        setFootballerData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDropData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">Loading...</div>
    );
  }

  if (!footballerData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-red-500">Drop not found</h1>
        <p className="text-gray-500">
          Please check the link or go back to drops.
        </p>
      </div>
    );
  }

  const { footballer, footballerImage, products, collabTitle, collabBanner } =
    footballerData;

  return (
    <>
      {/* Drop Overview */}
      <section className="py-16 px-4 lg:px-0">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-500 border border-gray-100">
          {/* Left */}
          <div className="lg:w-1/2 p-8 text-center lg:text-left">
            <h2 className="text-lg font-semibold text-sky-600 mb-2 tracking-wide uppercase">
              {footballer} Drop
            </h2>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-sky-600 to-blue-600 text-transparent bg-clip-text">
              {collabTitle}
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Discover the exclusive collection worn by {footballer}.
            </p>
            {/* <button className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800">
              Buy Now
            </button> */}
          </div>

          {/* Right */}
          <div className="lg:w-1/2 relative group overflow-hidden">
            <img
              src={footballerImage}
              alt={footballer}
              className="w-full h-[700px] object-cover transition-transform duration-700 ease-in-out scale-100 group-hover:scale-105"
            />

            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm">
                ⚽
              </div>
              <span className="text-gray-800 font-semibold text-sm">
                {footballer}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Used Dress Section */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">
          Used Drop Collection
        </h2>
        <ProductGrid products={products} />
      </section>
    </>
  );
};

export default DropDetail;
