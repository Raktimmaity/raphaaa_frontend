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
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow duration-500">
        {/* left content */}
        <div className="lg:w-1/2 p-8 text-center lg:text-left animate-fade-in">
          <span className="inline-block bg-gradient-to-r from-sky-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            LIMITED EDITION
          </span>
          <h2 className="text-lg font-semibold text-pink-600 mb-2 tracking-wide uppercase">
          Exclusive Drop
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-red-500 to-yellow-400 text-transparent bg-clip-text">
           Raphaaa X {featuredCollab.title}
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Step into the spotlight with our electrifying collab featuring world
            football stars. A powerful blend of street fashion and sports
            heritage — bold, iconic, and limited.
          </p>

          <Link
            // to={`/collab/${featuredCollab._id}`}
            to={`/exclusive-drop`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:scale-105 transition-transform duration-300"
          >
            Explore Drop <FaArrowRight className="ml-1" />
          </Link>
        </div>

        {/* right content */}
        <div className="lg:w-1/2">
          <img
            src={featuredCollab.image}
            alt="Featured Collection"
            className="w-full h-[700px] object-cover lg:rounded-tr-3xl lg:rounded-br-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
