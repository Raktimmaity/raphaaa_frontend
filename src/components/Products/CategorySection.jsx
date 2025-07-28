import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Tshirt from "../../assets/t-shirt.png";
import women from "../../assets/women.png";
import casual from "../../assets/casual.png";
import classic from "../../assets/classic.png";
import useSmartLoader from "../../hooks/useSmartLoader";

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
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => setLoading(false), 1000); // simulate load
  //   return () => clearTimeout(timer);
  // }, []);
  const { loading } = useSmartLoader(async () => {
  await new Promise((res) => setTimeout(res, 300));
  return true;
});


  return (
    <section className="px-4 md:px-16 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
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
                className="bg-white/20 backdrop-blur-md border border-white/20 hover:shadow-xl rounded-t-full rounded-b-xl flex flex-col items-center justify-between text-center transition-all duration-300 group relative overflow-hidden hover:ring-2 hover:ring-sky-400 hover:ring-offset-2"
              >
                <div className="flex items-center justify-center min-h-[130px] relative z-10">
                  <div className="absolute w-40 h-40 rounded-full blur-2xl bg-sky-300 opacity-30 z-0 group-hover:scale-125 transition-transform duration-500" />
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-44 h-44 sm:w-52 sm:h-52 object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <p className="text-lg md:text-xl font-semibold w-full py-2 text-white bg-gradient-to-r from-pink-500 to-red-600 group-hover:opacity-95 z-10 shadow-inner">
                  {category.name}
                </p>
              </Link>
            ))}
      </div>
    </section>
  );
};

export default CategorySection;
