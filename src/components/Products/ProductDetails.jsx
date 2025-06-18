import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { HiOutlineShoppingBag } from "react-icons/hi";

const selectedProduct = {
  name: "Stylish Jacket",
  price: 120,
  originalPrice: 150,
  description: "This is a stylish jacket",
  brand: "Raphaaa",
  material: "Leather",
  sizes: ["S", "M", "L", "XL"],
  colors: ["Black", "Brown", "Blue"],
  images: [
    {
      url: "https://picsum.photos/500/500?random=1",
      altText: "Stylish Jacket Front View",
    },
    {
      url: "https://picsum.photos/500/500?random=2",
      altText: "Stylish Jacket Side View",
    },
  ],
};

const similarProducts = [
  {
    _id: 1,
    name: "Product 1",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=3" }],
  },
  {
    _id: 2,
    name: "Product 2",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=4" }],
  },
  {
    _id: 3,
    name: "Product 3",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=5" }],
  },
  {
    _id: 4,
    name: "Product 4",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=6" }],
  },
];

const ProductDetails = () => {
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") {
      setQuantity((prev) => prev + 1);
    }
    if (action === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.", {
        duration: 1000,
      });
      return;
    }
    setIsButtonDisabled(true);
    setTimeout(() => {
      toast.success("Product added to cart!", { duration: 1000 });
      setIsButtonDisabled(false);
    }, 500);
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 via-white to-sky-100 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 rounded-xl cursor-pointer border transition-all duration-300 ${
                  mainImage === image.url
                    ? "border-sky-600 shadow-lg scale-105"
                    : "border-gray-300 hover:border-sky-400"
                }`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="md:w-1/2">
            <img
              src={mainImage}
              alt="Main Product"
              className="w-full h-auto object-cover rounded-2xl shadow-xl transition-all duration-500"
            />
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {selectedProduct.name}
              </h1>
              <div className="text-gray-500 line-through">
                ${selectedProduct.originalPrice}
              </div>
              <div className="text-2xl font-semibold text-sky-700 mb-4">
                ${selectedProduct.price}
              </div>
              <p className="text-gray-600 mb-6">
                {selectedProduct.description}
              </p>

              {/* Colors */}
              <div className="mb-6">
                <p className="font-medium text-gray-700 mb-2">Color:</p>
                <div className="flex gap-3">
                  {selectedProduct.colors.map((color) => (
                    <button
                      onClick={() => setSelectedColor(color)}
                      key={color}
                      className={`w-9 h-9 rounded-full border transition-all duration-300 ${
                        selectedColor === color
                          ? "border-4 border-sky-600 scale-110"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <p className="font-medium text-gray-700 mb-2">Size:</p>
                <div className="flex gap-3">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      onClick={() => setSelectedSize(size)}
                      key={size}
                      className={`px-4 py-2 rounded-xl border transition-all duration-200 font-medium ${
                        selectedSize === size
                          ? "bg-sky-600 text-white"
                          : "border-gray-300 hover:bg-sky-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="font-medium text-gray-700 mb-2">Quantity:</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`relative group overflow-hidden rounded-full py-3 px-8 w-full text-white font-semibold transition-all duration-300 ${
                  isButtonDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-sky-600 hover:bg-sky-700"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {!isButtonDisabled && (
                    <HiOutlineShoppingBag className="text-lg" />
                  )}
                  {isButtonDisabled ? "Adding..." : "ADD TO CART"}
                </span>

                {!isButtonDisabled && (
                  <span className="absolute inset-0 bg-white opacity-10 group-hover:animate-ping rounded-full z-0" />
                )}
              </button>
            </div>

            {/* Characteristics */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Characteristics
              </h3>
              <table className="w-full text-sm text-gray-600">
                <tbody>
                  <tr className="border-t">
                    <td className="py-2 font-medium">Brand</td>
                    <td>{selectedProduct.brand}</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 font-medium">Material</td>
                    <td>{selectedProduct.material}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            You May Also Like
          </h2>
          <ProductGrid products={similarProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
