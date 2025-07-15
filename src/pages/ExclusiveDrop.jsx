import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ExclusiveDrop = () => {
  const [exclusiveDrops, setExclusiveDrops] = useState([]);

  useEffect(() => {
    const fetchDrops = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/collabs`);
        setExclusiveDrops(data); // Only published ones will be returned
      } catch (err) {
        toast.error("Failed to load exclusive drops");
      }
    };
    fetchDrops();
  }, []);

  return (
    <section className="container mx-auto px-4 py-14">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block text-xs font-semibold bg-gradient-to-r from-sky-600 to-blue-600 text-white px-4 py-1 rounded-full uppercase tracking-widest mb-3">
          Limited Edition
        </span>
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
          Exclusive Drops
        </h2>
        <p className="text-gray-600 mt-2 text-sm font-medium">
          Football Legends x Raphaa Limited Edition
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {exclusiveDrops.flatMap((collab, index) =>
          collab.collaborators.map((person, i) => (
            <motion.div
              key={`${collab._id}-${i}`}
              className="group bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={`/exclusive-drop/${person.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <img
                  src={person.image}
                  alt={person.name}
                  className="md:h-[550px] w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800">{person.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {person.products?.[0]?.name || "Featured Product"}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <img
                    src={
                      person.image || "/no-image.png"
                    }
                    alt="Product"
                    className="h-12 w-12 object-cover rounded-full border-2 border-sky-400 shadow-md"
                  />
                  <Link
                    to={`/exclusive-drop/${person.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="flex items-center text-sm font-semibold text-sky-600 hover:text-blue-700 transition"
                  >
                    View More <FaArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default ExclusiveDrop;
