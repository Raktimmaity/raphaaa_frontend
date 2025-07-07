import { useEffect, useState } from 'react';
import { TbBrandMeta } from 'react-icons/tb';
import { IoLogoInstagram } from 'react-icons/io5';
import { RiTwitterXLine } from 'react-icons/ri';

const Topbar = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className='bg-gradient-to-r from-sky-100 via-sky-300 to-sky-30 text-zinc-800'>
        <div className="container mx-auto flex justify-between items-center py-3">
          {/* Left Skeleton */}
          <div className='hidden md:flex items-center space-x-4'>
            <div className="h-5 w-5 bg-sky-200 rounded-full animate-pulse"></div>
            <div className="h-5 w-5 bg-sky-200 rounded-full animate-pulse"></div>
          </div>

          {/* Center Skeleton */}
          <div className="text-sm text-center flex-grow">
            <div className="h-4 w-60 mx-auto bg-sky-200 rounded animate-pulse"></div>
          </div>

          {/* Right Skeleton */}
          <div className="text-sm hidden md:block">
            <div className="h-4 w-28 bg-sky-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-r from-sky-100 via-sky-300 to-sky-30 text-zinc-800'>
      <div className="container mx-auto flex justify-between itmes-center py-3">
        <div className='hidden md:flex items-center space-x-4'>
          <a href="https://www.facebook.com/Raphaaa.Store/" className='hover:text-sky-500'>
            <TbBrandMeta className='h-5 w-5' />
          </a>
          <a href="https://www.instagram.com/raphaaaofficial/" className='hover:text-sky-500'>
            <IoLogoInstagram className='h-5 w-5' />
          </a>
          {/* <a href="#" className='hover:text-gray-300'>
              <RiTwitterXLine className='h-4 w-4' />
          </a> */}
        </div>

        <div className="text-sm text-center flex-grow">
          {/* Show marquee only on small screens */}
          <div className="block md:hidden">
            <marquee behavior="scroll" direction="left" scrollamount="5">
              <span className="font-semibold">We ship worldwide - Fast and reliable shipping!!</span>
            </marquee>
          </div>

          {/* Show static text on md and larger */}
          <div className="hidden md:block">
            <span className="font-normal">We ship worldwide - Fast and reliable shipping!!</span>
          </div>
        </div>

        <div className="text-sm hidden md:block">
          <a href="#" className='hover:text-sky-500'>+91 949615691161</a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
