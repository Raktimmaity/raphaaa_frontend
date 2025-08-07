import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";

const FeaturedCollection = () => {
  const [featuredCollab, setFeaturedCollab] = useState(null);

  useEffect(() => {
    const fetchCollab = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/collabs`
        );
        if (data && data.length > 0) {
          setFeaturedCollab(data[0]);
        }
      } catch (err) {
        console.error("Failed to load featured collab", err);
      }
    };

    fetchCollab();
  }, []);

  if (!featuredCollab || !featuredCollab.isPublished) return null;

  return (
    <section className="relative px-6 md:px-20 py-16 md:h-[90vh] overflow-hidden bg-gradient-to-r from-[#fdfbfb] to-[#ebedee] flex flex-col-reverse sm:flex-row items-center justify-between gap-10">
      {/* Glow Background Effects */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-400 opacity-20 rounded-full blur-[100px] z-0" />
      <div className="absolute bottom-0 -right-10 w-[500px] h-[500px] bg-sky-400 opacity-20 rounded-full blur-[120px] z-0" />

      {/* Floating Badge */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10">
        <div className="bg-gradient-to-r from-indigo-600 to-sky-500 text-white px-5 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse tracking-wide">
          🚀 Exclusive Collab
        </div>
      </div>

      {/* Left Side Text */}
      <div className="relative z-10 w-full sm:w-1/2 text-center sm:text-left space-y-6">
        <p className="text-xs uppercase font-bold tracking-wider text-blue-600">
          Limited Edition Drop
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text drop-shadow-xl">
          Raphaaa X {featuredCollab.title}
        </h1>

        <p className="text-gray-700 text-sm md:text-lg leading-relaxed max-w-md">
          Where fashion meets football stardom. Drop curated with iconic energy,
          bold vibes, and top-tier quality. Unleash the power of streetwear.
        </p>

        <div className="flex items-center gap-4 mt-4 justify-center sm:justify-start">
          <Link
            to="/exclusive-drop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm md:text-base font-semibold bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Explore Drop <FaArrowRight className="ml-1" />
          </Link>
          <span className="text-xs text-gray-500 hidden md:inline">
            Hurry, before it’s gone!
          </span>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="relative z-10 w-full sm:w-1/2 flex justify-center">
        <div className="w-[90%] sm:w-[95%] aspect-square overflow-hidden rounded-full shadow-2xl border-4 border-white bg-white">
          <img
            src={featuredCollab.image.replace(/\.(jpeg|jpg|png)$/i, ".webp")}
            alt={featuredCollab.title}
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
