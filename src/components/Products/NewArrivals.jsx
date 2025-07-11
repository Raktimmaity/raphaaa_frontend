import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Auto-scroll with loop & pause on hover
  useEffect(() => {
    let isHovered = false;
    const container = scrollRef.current;

    const handleMouseEnter = () => (isHovered = true);
    const handleMouseLeave = () => (isHovered = false);

    container?.addEventListener("mouseenter", handleMouseEnter);
    container?.addEventListener("mouseleave", handleMouseLeave);

    const interval = setInterval(() => {
      if (!isHovered && container) {
        container.scrollLeft -= 1;

        // Loop to end if at beginning
        if (container.scrollLeft <= 0) {
          container.scrollLeft = container.scrollWidth / 2;
        }
      }
    }, 20); // adjust speed here

    return () => {
      clearInterval(interval);
      container?.removeEventListener("mouseenter", handleMouseEnter);
      container?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // ✅ Fetch latest products
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

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

    updateScrollButtons();
    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [newArrivals]);

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

        {/* Scroll Buttons */}
        {/* <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-2 z-10">
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
        </div> */}
      </div>

      {/* Scrollable Product Cards (duplicated for looping) */}
      <div
        ref={scrollRef}
        className="container mx-auto overflow-x-auto flex space-x-6 scroll-smooth px-2 pb-6 new-arrivals-track"
      >
        {(loading
          ? Array.from({ length: 4 })
          : [...newArrivals, ...newArrivals]
        ).map((product, index) =>
          loading ? (
            <div
              key={index}
              className="min-w-[85%] sm:min-w-[50%] md:min-w-[40%] lg:min-w-[30%] bg-gray-100 shadow-md rounded-xl animate-pulse"
            >
              <div className="h-80 w-full bg-gray-300 rounded-t-xl" />
              <div className="p-4">
                <div className="h-4 w-3/4 bg-gray-300 rounded mb-2" />
                <div className="h-4 w-1/2 bg-gray-300 rounded" />
              </div>
            </div>
          ) : (
            <div
              key={`${product._id}_${index}`}
              className="min-w-[250px] bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl shadow-md border border-sky-200 hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="w-full h-80 relative overflow-hidden rounded-t-xl">
                <img
                  src={product.images?.[0]?.url}
                  alt={product.images?.[0]?.altText || product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {new Date() - new Date(product.createdAt) <
                  2 * 24 * 60 * 60 * 1000 && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-[10px] font-bold px-2 py-[2px] rounded-full shadow-md animate-bounce uppercase tracking-wider">
                    New
                  </div>
                )}
              </div>
              <div className="p-4 text-left">
                <Link to={`/product/${product._id}`} className="block">
                  <h4 className="font-semibold text-blue-900 group-hover:text-sky-600 transition-colors truncate">
                    {product.name}
                  </h4>
                  {product.discountPrice &&
                  product.discountPrice < product.price ? (
                    <div className="flex gap-2 items-center flex-wrap mt-1">
                      <p className="text-blue-700 font-bold text-xl">
                        ₹ {product.discountPrice}
                      </p>
                      <p className="text-sm text-gray-500 line-through">
                        ₹ {product.price}
                      </p>
                      <p className="text-green-600 text-sm font-semibold">
                        {Math.round(
                          ((product.price - product.discountPrice) * 100) /
                            product.price
                        )}
                        % OFF
                      </p>
                    </div>
                  ) : (
                    <p className="text-blue-700 font-bold text-xl mt-1">
                      ₹ {product.price}
                    </p>
                  )}
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
