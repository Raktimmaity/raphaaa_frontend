import { useEffect, useState } from "react";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io5";
import { RiCustomerServiceFill, RiTwitterXLine } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";
import axios from "axios";
import useSmartLoader from "../../hooks/useSmartLoader";

const Topbar = () => {
  // const [loading, setLoading] = useState(true);
  // const [contactInfo, setContactInfo] = useState(null);

  // useEffect(() => {
  //   const timer = setTimeout(() => setLoading(false), 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  const { loading, data: contactInfo } = useSmartLoader(async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/settings/contact`);
    return res.data;
  })

  // useEffect(() => {
  //   const fetchContactInfo = async () => {
  //     try {
  //       const res = await axios.get(
  //         `${import.meta.env.VITE_BACKEND_URL}/api/settings/contact`
  //       );
  //       setContactInfo(res.data);
  //     } catch (err) {
  //       console.error("Failed to load contact settings", err);
  //     }
  //   };
  //   fetchContactInfo();
  // }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-sky-100 via-sky-300 to-sky-50 text-zinc-800">
        <div className="container mx-auto flex justify-between items-center py-3">
          <div className="hidden md:flex items-center space-x-4">
            <div className="h-5 w-5 bg-sky-200 rounded-full animate-pulse"></div>
            <div className="h-5 w-5 bg-sky-200 rounded-full animate-pulse"></div>
          </div>
          <div className="text-sm text-center flex-grow">
            <div className="h-4 w-60 mx-auto bg-sky-200 rounded animate-pulse"></div>
          </div>
          <div className="text-sm hidden md:block">
            <div className="h-4 w-28 bg-sky-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-sky-100 via-sky-300 to-sky-50 text-zinc-800">
      <div className="container mx-auto flex justify-between items-center py-3 px-4 md:px-0">
        {/* Left: Social Icons */}
        <div className="hidden md:flex items-center space-x-4">
          {contactInfo?.showFacebook && (
            <a
              href={contactInfo.facebookUrl}
              className="hover:text-blue-600 transition-transform duration-200 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook className="h-5 w-5" />
            </a>
          )}
          {contactInfo?.showInstagram && (
            <a
              href={contactInfo.instagramUrl}
              className="hover:text-pink-600 transition-transform duration-200 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
          )}
          {/* Twitter support can be added later */}
        </div>

        {/* Center: Shipping message */}
        <div className="text-sm text-center flex-grow font-medium text-gray-800">
          <div className="block md:hidden">
            <marquee behavior="scroll" direction="left" scrollamount="5">
              <span className="font-semibold">
                We ship worldwide - Fast and reliable shipping!!
              </span>
            </marquee>
          </div>
          <div className="hidden md:block">
            {contactInfo?.showTopText && (
              <span>
                {/* We ship worldwide — <span className="text-blue-700">Fast & Reliable Shipping!</span> */}
                {contactInfo.topText}
              </span>
            )}
          </div>
        </div>

        {/* Right: Phone Number */}
        {contactInfo?.showPhone && (
          <div className="text-sm hidden md:flex md:flex-wrap md:justify-center md:items-center md:gap-1">
            <RiCustomerServiceFill size={16} className='font-bold' /> Helpline:
            <a
              href={`tel:${contactInfo.phone}`}
              className="text-blue-700 font-semibold hover:text-sky-600 transition-colors duration-200"
            >
              {contactInfo.phone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
