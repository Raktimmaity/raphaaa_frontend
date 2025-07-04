import React, { useState } from 'react'
import { IoCall, IoLogoInstagram } from 'react-icons/io5'
import { RiTwitterXLine } from 'react-icons/ri'
import { TbBrandMeta, TbFilePhone } from 'react-icons/tb'
import { Link } from 'react-router-dom'

const Footer = () => {
  const [subscribe, setSubscribe] = useState("");
  return (
    <footer className="py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        {/* Newsletter */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Newsletter</h3>
          <p className="text-gray-500 mb-4">
            Be the first to hear about new products, exclusive events and online offers.
          </p>
          <p className='font-medium text-sm text-gray-600 mb-6'>
            Sign up and get 10% off your first order.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full text-sm border bg-white border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              value={subscribe}
              onChange={(e) => setSubscribe(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-sky-500 text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Shop links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="/collections/all?category=Top+Wear&gender=Men" className="hover:text-gray-500 transition-colors">Men's top wear</Link>
            </li>
            <li>
              <Link to="/collections/all?category=Top+Wear&gender=Women" className="hover:text-gray-500 transition-colors">Women's top wear</Link>
            </li>
            <li>
              <Link to="/collections/all?category=Bottom+Wear&gender=Men" className="hover:text-gray-500 transition-colors">Men's bottom wear</Link>
            </li>
            <li>
              <Link to="/collections/all?category=Bottom+Wear&gender=Women" className="hover:text-gray-500 transition-colors">Women's bottom wear</Link>
            </li>
          </ul>
        </div>
        {/* support links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="/collections/all" className="hover:text-gray-500 transition-colors">All Collections</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-500 transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-gray-500 transition-colors">Contact Us</Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-gray-500 transition-colors">Privacy & Policy</Link>
            </li>
          </ul>
        </div>
        {/* Follow us */}
        <div>
            <h3 className="text-lg text-gray-800 mb-4">Follow Us</h3>
            <div className="flex items-center space-x-4 mb-6">
                <a href="https://www.facebook.com/Raphaaa.Store/" target="_blank" rel='noopener noreferrer' className="hover:text-sky-500">
                    <TbBrandMeta className='h-5 w-5'/>
                </a>
                <a href="https://www.instagram.com/raphaaaofficial/" target="_blank" rel='noopener noreferrer' className="hover:text-sky-500">
                    <IoLogoInstagram className='h-5 w-5'/>
                </a>
                {/* <a href="https://www.twitter.com" target="_blank" rel='noopener noreferrer' className="hover:text-gray-300">
                    <RiTwitterXLine className='h-5 w-5'/>
                </a> */}
            </div>
            <p className='text-gray-500'>Call Us</p>
            <p>
                <IoCall className='inline-block mr-2'/>
                +91 949615691161
            </p>
        </div>
      </div>
      <hr className='border-gray-200 mt-3' />
      {/* footer copy right text */}
      <div className="container mx-auto mt-6 px-4 lg:px-0 border-gray-200 pt-6">
        <p className='text-center text-gray-500 text-sm'>
            © 2025 Raphaaa. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer