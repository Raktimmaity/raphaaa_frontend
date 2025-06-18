import React from 'react';
import { HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi';
import { HiArrowPathRoundedSquare } from 'react-icons/hi2';

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-sky-50 to-sky-100">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* feature 1 */}
        <div className="flex flex-col items-center transition-all duration-300 hover:-translate-y-1">
          <div className="p-4 rounded-full bg-white shadow-md mb-4">
            <HiShoppingBag className="text-3xl text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-800 text-lg mb-2 tracking-tight">
            Free International Shipping
          </h4>
          <p className="text-gray-600 text-sm tracking-tight">
            On all orders over $100.00
          </p>
        </div>
        {/* feature 2 */}
        <div className="flex flex-col items-center transition-all duration-300 hover:-translate-y-1">
          <div className="p-4 rounded-full bg-white shadow-md mb-4">
            <HiArrowPathRoundedSquare className="text-3xl text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-800 text-lg mb-2 tracking-tight">
            45 Days Return
          </h4>
          <p className="text-gray-600 text-sm tracking-tight">
            Money back guarantee
          </p>
        </div>
        {/* feature 3 */}
        <div className="flex flex-col items-center transition-all duration-300 hover:-translate-y-1">
          <div className="p-4 rounded-full bg-white shadow-md mb-4">
            <HiOutlineCreditCard className="text-3xl text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-800 text-lg mb-2 tracking-tight">
            Secure Checkout
          </h4>
          <p className="text-gray-600 text-sm tracking-tight">
            100% secured checkout process
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
