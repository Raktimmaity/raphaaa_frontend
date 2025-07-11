import { Link } from "react-router-dom";
import jeans from "../../assets/jeans.png";

// Replace with actual image URLs or category icons
const categories = [
  {
    name: "T-Shirts",
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5437.png",
    slug: "t-shirt",
  },
  {
    name: "Jeans",
    image: jeans,
    slug: "jeans",
  },
  {
    name: "Shoes",
    image: "https://cdn-icons-png.flaticon.com/512/892/892463.png",
    slug: "shoes",
  },
  {
    name: "Jackets",
    image: "https://cdn-icons-png.flaticon.com/512/892/892460.png",
    slug: "jackets",
  },
  {
    name: "Shirts",
    image: "https://cdn-icons-png.flaticon.com/512/892/892464.png",
    slug: "shirts",
  },
  {
    name: "Accessories",
    image: "https://cdn-icons-png.flaticon.com/512/3313/3313441.png",
    slug: "accessories",
  },
];

const CategorySection = () => {
  return (
    <section className="px-4 md:px-16 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Shop by Category
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 md:gap-8 md:overflow-visible">
        {categories.map((category) => (
          <Link
            to={`/collections/all?search=${category.slug}`}
            key={category.slug}
            className="min-w-[100px] md:min-w-0 bg-white hover:shadow-lg border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center transition-all duration-300 group"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-16 h-16 object-contain mb-2 transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <span className="text-sm font-medium text-gray-800 group-hover:text-sky-600">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
