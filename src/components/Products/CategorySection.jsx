import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Tshirt from "../../assets/t-shirt.png";
import women from "../../assets/women.png";
import casual from "../../assets/casual.png";
import classic from "../../assets/classic.png";

const categories = [
  {
    name: "T-Shirts",
    image: Tshirt,
    slug: "search=t-shirt",
  },
  {
    name: "Women",
    image: women,
    slug: "category=Top+Wear&gender=Women",
  },
  {
    name: "Casual",
    image: casual,
    slug: "search=casual",
  },
  {
    name: "Classic",
    image: classic,
    slug: "jackets",
  },
];

const CategorySection = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // simulate load
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="px-4 md:px-16 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-28">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-t-full rounded-b-xl flex flex-col items-center justify-center text-center animate-pulse"
              >
                <div className="w-full h-full p-4">
                  <div className="w-28 h-28 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="h-4 w-24 bg-gray-300 mx-auto rounded"></div>
                </div>
              </div>
            ))
          : categories.map((category) => (
              <Link
                to={`/collections/all?${category.slug}`}
                key={category.slug}
                className="relative bg-white hover:shadow-lg border border-gray-200 rounded-t-full rounded-b-xl flex flex-col items-center justify-end text-center transition-all duration-300 group"
              >
                {/* ✅ Fixed large image floated on top */}
                <div className="relative -top-12">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-28 h-28 md:w-full md:h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* ✅ Title below */}
                <p className="text-lg font-medium w-full py-2 text-white bg-gradient-to-r from-sky-500 to-blue-600 group-hover:opacity-90 rounded-b-xl">
                  {category.name}
                </p>
              </Link>
            ))}
      </div>
    </section>
  );
};

export default CategorySection;
