import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Handle adding or subtracting to cart
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  const totalAmount = cart.products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4 space-y-4">
      {cart.products.map((product, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row sm:items-start justify-between transition-all hover:shadow-lg"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-28 h-32 object-cover rounded-xl"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500">
                Size: {product.size} | Color: {product.color}
              </p>
              {/* <p className="text-sm text-gray-600 mt-1">
                Quantity: {product.quantity}
              </p>
              <p className="text-sm text-gray-700 font-semibold mt-1">
                Price: ₹{(product.price * product.quantity).toLocaleString("en-IN")}
              </p> */}

              <div className="flex items-center mt-3 space-x-3">
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="bg-gray-200 text-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="text-lg font-medium">{product.quantity}</span>
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="bg-gray-800 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-900 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 sm:ml-4">
            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color
                )
              }
              className="text-red-600 hover:text-red-800 transition"
            >
              <RiDeleteBin3Line className="h-6 w-6" />
            </button>
          </div>
        </div>
      ))}

      {/* ✅ Total Cart Summary Section */}
      {cart.products.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl shadow-inner">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Cart Summary
          </h2>
          <div className="flex justify-between text-gray-800 font-medium text-base">
            <span>Total Items:</span>
            <span>{cart.products.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-gray-800 font-semibold text-lg mt-1">
            <span>Total Price:</span>
            <span>₹{totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartContents;
