import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const exclusiveDrops = [
  {
    name: "Cristiano Ronaldo",
    image: "https://picsum.photos/seed/ronaldo/500/400",
    product: "R7 Streetwear Edition",
    productImage: "https://picsum.photos/seed/r7product/100/100",
    slug: "ronaldo",
  },
  {
    name: "Lionel Messi",
    image: "https://picsum.photos/seed/messi/500/400",
    product: "Messi x Raphaa Fusion Jacket",
    productImage: "https://picsum.photos/seed/messiproduct/100/100",
    slug: "messi",
  },
  {
    name: "Kylian Mbappé",
    image: "https://picsum.photos/seed/mbappe/500/400",
    product: "KM Speed Series",
    productImage: "https://picsum.photos/seed/kmspeed/100/100",
    slug: "mbappe",
  },
];

const ExclusiveDrop = () => {
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
        {exclusiveDrops.map((item, index) => (
          <motion.div
            key={index}
            className="group bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link to={`/exclusive-drop/${item.slug}`}>
              <img
                src={item.image}
                alt={item.name}
                className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.product}</p>

              <div className="mt-6 flex items-center justify-between">
                <img
                  src={item.productImage}
                  alt="Product"
                  className="h-12 w-12 object-cover rounded-full border-2 border-sky-400 shadow-md"
                />
                <Link
                  to={`/exclusive-drop/${item.slug}`}
                  className="flex items-center text-sm font-semibold text-sky-600 hover:text-blue-700 transition"
                >
                  View More <FaArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ExclusiveDrop;
