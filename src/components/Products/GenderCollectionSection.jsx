import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import menImg from "../../assets/mens-collection.jpg";
import womenImg from "../../assets/womens-collection.jpg";
import product1 from "../../assets/product1.jpg";
import product2 from "../../assets/product2.jpg";

const GenderCollectionSection = () => {
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
            className="w-full h-[500px] md:h-[600px] lg:h-[700px] object-cover transition-transform duration-500 group-hover:scale-105 rounded-xl"
          />
          {/* Overlay */}
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
            className="w-full h-[500px] md:h-[600px] lg:h-[800px] object-cover transition-transform duration-500 group-hover:scale-105 rounded-xl"
          />
          {/* Overlay */}
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
