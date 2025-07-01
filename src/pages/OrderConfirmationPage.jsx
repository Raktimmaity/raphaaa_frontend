import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

// const checkout = {
//   _id: "12323",
//   createdAt: new Date(),
//   checkoutItems: [
//     {
//       ProductId: "1",
//       name: "Jacket",
//       color: "Black",
//       size: "M",
//       price: 150,
//       quantity: 1,
//       image: "https://picsum.photos/150?random=1",
//     },
//     {
//       ProductId: "2",
//       name: "T-shirt",
//       color: "Black",
//       size: "M",
//       price: 120,
//       quantity: 2,
//       image: "https://picsum.photos/150?random=2",
//     },
//   ],
//   shippingAddress: {
//     address: "123 Fashion Street",
//     city: "New York",
//     country: "USA",
//   },
// };



const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  // clear the cart when the order is confirmed
  useEffect(() => {
    if(checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate])
  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // Add 10 days
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-10">
        Thank you for your Order!
      </h1>

      {checkout && (
        <div className="space-y-10">
          {/* Order Details */}
          <div className="flex flex-col md:flex-row justify-between gap-6 md:items-center border-b pb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Order ID: <span className="text-gray-600">{checkout._id}</span>
              </h2>
              <p className="text-sm text-gray-500">
                Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-emerald-700 font-medium">
                Estimated Delivery:{" "}
                {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            {checkout.checkoutItems.map((item) => (
              <div
                key={item.ProductId}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover border"
                  />
                  <div>
                    <h4 className="text-md font-semibold text-gray-800">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {item.color} | Size {item.size}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-md text-gray-800 font-semibold">
                    ${item.price}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment & Delivery Info */}
          <div className="grid md:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Payment Method
              </h4>
              <p className="text-gray-600">PayPal</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Shipping Address
              </h4>
              <p className="text-gray-600">{checkout.shippingAddress.address}</p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
