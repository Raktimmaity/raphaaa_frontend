import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";

const cart = {
  products: [
    {
      name: "Stylish Jacket",
      size: "M",
      color: "Black",
      price: 120,
      image: "https://picsum.photos/150?random=1",
    },
    {
      name: "Casual Sneakers",
      size: "42",
      color: "White",
      price: 75,
      image: "https://picsum.photos/150?random=2",
    },
  ],
  totalPrice: 195,
};

const Checkout = () => {
  const navigate = useNavigate();
  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const handleCreateCheckout = (e) => {
    e.preventDefault();
    setCheckoutId(123);
  };

  const handlePaymentSuccess = (details) => {
    console.log("Payment Successfull", details);
    navigate("/order-confirmation");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto py-12 px-6">
      {/* Left Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 border">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 uppercase tracking-tight">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Details</h3>
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value="user@example.com"
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600"
              disabled
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">First Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                required
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Last Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                required
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Address</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              required
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, address: e.target.value })
              }
            />
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">City</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                required
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                required
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Country</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                required
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, country: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input
                type="tel"
                className="w-full p-3 border rounded-lg"
                required
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-6">
            {!checkoutId ? (
              <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition">
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4">Pay with PayPal</h3>
                <PayPalButton
                  amount={100.0}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => alert("Payment failed. Try again")}
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="bg-gray-50 p-8 rounded-xl border shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h3>
        <div className="space-y-6">
          {cart.products.map((product, index) => (
            <div key={index} className="flex items-start gap-4 border-b pb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-24 object-cover rounded-md border"
              />
              <div className="flex-1">
                <h4 className="text-md font-semibold text-gray-700">{product.name}</h4>
                <p className="text-sm text-gray-500">Size: {product.size}</p>
                <p className="text-sm text-gray-500">Color: {product.color}</p>
              </div>
              <p className="text-lg font-medium text-gray-800">
                ₹{product.price?.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2 text-lg text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{cart.totalPrice?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="flex justify-between border-t pt-4 font-semibold text-gray-900">
            <span>Total</span>
            <span>₹{cart.totalPrice?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
