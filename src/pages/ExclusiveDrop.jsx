import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import ProductGrid from "../components/Products/ProductGrid";

const ExclusiveDrop = () => {
  const [exclusiveDrops, setExclusiveDrops] = useState([]);
  const [flippedCard, setFlippedCard] = useState(null);
  const [dropDetails, setDropDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all drops
  useEffect(() => {
    const fetchDrops = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/collabs`
        );
        setExclusiveDrops(data);
      } catch (err) {
        toast.error("Failed to load exclusive drops");
      }
    };
    fetchDrops();
  }, []);

  // Fetch drop detail when footballer selected
  useEffect(() => {
    if (!flippedCard) return;
    const fetchDropData = async () => {
      setLoading(true);
      try {
        const slug = flippedCard.toLowerCase().replace(/\s+/g, "-");
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/collabs/footballer/${slug}`
        );
        setDropDetails(data);
      } catch (err) {
        toast.error("Drop not found or unpublished");
        setDropDetails(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDropData();
  }, [flippedCard]);

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

      {/* Grid of flip cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10 perspective">
        {exclusiveDrops.flatMap((collab, index) =>
          collab.collaborators.map((person, i) => {
            const isFlipped = flippedCard === person.name;
            return (
              <motion.div
                key={`${collab._id}-${i}`}
                className={`relative w-full h-[450px] cursor-pointer`}
                onClick={() =>
                  setFlippedCard(isFlipped ? null : person.name)
                }
              >
                <motion.div
                  className={`absolute inset-0 transition-transform duration-700 preserve-3d ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden shadow-lg">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 text-white">
                      <h3 className="text-xl font-bold">{person.name}</h3>
                      <p className="text-sm">
                        {person.products?.[0]?.name || "Exclusive Drop"}
                      </p>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-white shadow-xl p-6 overflow-y-auto custom-scrollbar">
                    {loading && <p>Loading...</p>}
                    {dropDetails && dropDetails.footballer === person.name && (
                      <>
                        <h3 className="text-2xl font-bold mb-4">
                          {dropDetails.footballer}
                        </h3>
                        <ProductGrid products={dropDetails.products} />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlippedCard(null);
                            setDropDetails(null);
                          }}
                          className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow hover:scale-105 transition"
                        >
                          ← Back
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default ExclusiveDrop;


// Drop 2 design