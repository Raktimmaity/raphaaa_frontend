import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const newArrivals = [
    {
      _id: "1",
      name: "Stylish Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/500?random=1",
          altText: "Stylish Jacket Front View",
        },
      ],
    },
    {
      _id: "2",
      name: "Stylish Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/500?random=2",
          altText: "Stylish Jacket Front View",
        },
      ],
    },
    {
      _id: "3",
      name: "Stylish Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/500?random=3",
          altText: "Stylish Jacket Front View",
        },
      ],
    },
    {
      _id: "4",
      name: "Stylish Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/500?random=4",
          altText: "Stylish Jacket Front View",
        },
      ],
    },
    {
      _id: "5",
      name: "Stylish Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/500?random=5",
          altText: "Stylish Jacket Front View",
        },
      ],
    },
    {
      _id: "6",
      name: "Stylish Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/500?random=6",
          altText: "Stylish Jacket Front View",
        },
      ],
    },
    {
      _id: "7",
      name: "Stylish Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/500?random=7",
          altText: "Stylish Jacket Front View",
        },
      ],
    },
    {
      _id: "8",
      name: "Stylish Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/500?random=8",
          altText: "Stylish Jacket Front View",
        },
      ],
    },
  ];

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = direction === "left" ? -300 : 300;
    if (container) {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const leftScroll = container.scrollLeft;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(leftScroll < maxScrollLeft);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateScrollButtons(); // on load

    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-2 inline-block relative">
          Explore New Arrivals
          <span className="block w-32 h-1 bg-gradient-to-r from-sky-300 to-sky-500 mx-auto mt-2 rounded-full"></span>
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Discover the latest styles straight off the runway, freshly added to
          keep your wardrobe on the cutting edge of fashion.
        </p>

        {/* scroll buttons */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-2 z-10">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border shadow-md transition-colors ${
              canScrollLeft
                ? "bg-white text-black hover:bg-sky-100"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <MdKeyboardArrowLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded-full border shadow-md transition-colors ${
              canScrollRight
                ? "bg-white text-black hover:bg-sky-100"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <MdKeyboardArrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Scrollable Product Cards */}
      <div
        ref={scrollRef}
        className="container mx-auto overflow-x-auto flex space-x-6 scroll-smooth scrollbar-hide px-2"
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[85%] sm:min-w-[50%] md:min-w-[40%] lg:min-w-[30%] bg-white shadow-md rounded-xl border border-gray-100 relative group transition-all duration-300 hover:shadow-xl"
          >
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText || product.name}
              className="h-80 w-full object-cover rounded-t-xl"
            />
            <div className="p-4 text-left">
              <Link to={`/product/${product._id}`} className="block">
                <h4 className="font-semibold text-gray-800 group-hover:text-sky-600 transition-colors">
                  {product.name}
                </h4>
                <p className="mt-1 text-gray-600">${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
