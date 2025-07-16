import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";

const FeaturedCollection = () => {
  const [featuredCollab, setFeaturedCollab] = useState(null);

  useEffect(() => {
    const fetchCollab = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/collabs`
        );

        // Pick the first published collab
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
  <section className="py-20 px-4 lg:px-0">
    <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-white/60 backdrop-blur-md border border-white/40 shadow-2xl rounded-3xl overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-shadow duration-500 group relative">
      
      {/* Background glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-pink-400 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-sky-500 opacity-30 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* left content */}
      <div className="relative z-10 lg:w-1/2 p-10 md:p-14 text-center lg:text-left animate-fade-in space-y-4">
        <span className="inline-block bg-gradient-to-r from-sky-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          LIMITED EDITION
        </span>
        <h2 className="text-lg font-semibold text-pink-600 tracking-wide uppercase">
          Exclusive Drop
        </h2>
        <h2 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-red-500 to-yellow-400 text-transparent bg-clip-text drop-shadow-sm">
          Raphaaa X {featuredCollab.title}
        </h2>
        <p className="text-md text-gray-700 leading-relaxed max-w-xl">
          Step into the spotlight with our electrifying collab featuring world
          football stars. A powerful blend of street fashion and sports
          heritage — bold, iconic, and limited.
        </p>

        <Link
          to={`/exclusive-drop`}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-all duration-300"
        >
          Explore Drop <FaArrowRight className="ml-1" />
        </Link>
      </div>

      {/* right content */}
      <div className="lg:w-1/2 relative z-10">
        <img
          src={featuredCollab.image}
          alt="Featured Collection"
          className="w-full h-[700px] object-cover lg:rounded-tr-3xl lg:rounded-br-3xl transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  </section>
);

};

export default FeaturedCollection;
