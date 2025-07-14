import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImg from "../../assets/heroimg.jpeg";
import heroImg2 from "../../assets/hero_img.png";
import heroImg3 from "../../assets/hero3.jpeg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
const heroImages = [heroImg, heroImg2, heroImg3];

const Hero = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simulate 1s load
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="md:h-[80vh] flex flex-col sm:flex-row justify-between gap-2 px-6 md:px-28 py-8">
        {/* Left Skeleton */}
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
          <div className="w-full h-60 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>

        {/* Right Skeleton */}
        <div className="w-full sm:w-1/2 aspect-square overflow-hidden">
          <div className="w-full h-full bg-gray-200 rounded-full md:rounded-l-none md:rounded-r-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:h-[80vh] flex flex-col sm:flex-row justify-between gap-2 px-6 md:px-28 py-8">
      {/* Hero Left Side */}
      <div
        className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 
        bg-white/70 backdrop-blur-lg border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl"
      >
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            <span className="text-black">Latest</span> Arrivals
          </h1>
          <div className="flex items-center gap-2">
            <Link
              to="/collections/all"
              className="font-semibold text-sm md:text-base bg-[#414141] text-white p-2"
            >
              SHOP NOW
            </Link>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>

      {/* Hero Right Side - Responsive Image Shape */}
      <div className="w-full sm:w-1/2 aspect-square overflow-hidden rounded-full md:rounded-l-none md:rounded-r-full shadow-md">
        <Swiper
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay]}
          className="w-full h-full"
        >
          {heroImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={img}
                alt={`Hero ${idx}`}
                className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Hero;
