import React from 'react'
import { Link } from 'react-router-dom'

const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {products.map((product, index) => (
        <Link
          key={index}
          to={`/product/${product._id}`}
          className="block group transition-transform transform hover:-translate-y-1"
        >
          <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="w-full h-96 mb-4 overflow-hidden rounded-lg">
              <img
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-base font-semibold text-blue-900 mb-2 truncate">
              {product.name}
            </h3>
            <p className="text-blue-700 font-semibold text-sm tracking-wide">
              ₹ {product.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ProductGrid