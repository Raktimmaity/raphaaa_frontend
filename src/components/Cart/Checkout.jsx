import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RazorpayButton from "./RazorpayButton";
import { useDispatch, useSelector } from "react-redux";
import {
  createRazorpayOrder,
  createCODOrder,
  verifyRazorpayPayment,
  handlePaymentFailure,
  clearCheckout,
} from "../../redux/slices/checkoutSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    cart,
    loading: cartLoading,
    error: cartError,
  } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const {
    order,
    loading: checkoutLoading,
    error: checkoutError,
    razorpayOrderId,
    orderId,
    razorpayKeyId,
    amount,
    currency,
  } = useSelector((state) => state.checkout);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [orderInitiated, setOrderInitiated] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [fullUser, setFullUser] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "India",
    phone: "+91",
  });

  const countries = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "China",
    "Brazil",
    "Russia",
    "Italy",
    "Spain",
    "Netherlands",
    "Sweden",
    "Switzerland",
    "Norway",
    "Denmark",
    "Finland",
    "Belgium",
    "Austria",
    "Portugal",
    "Greece",
    "Ireland",
    "Poland",
    "Czech Republic",
    "Hungary",
    "Romania",
    "Bulgaria",
    "Croatia",
    "Slovenia",
    "Slovakia",
    "Estonia",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Cyprus",
  ];

  useEffect(() => {
    dispatch(clearCheckout());
    setOrderInitiated(false);
  }, [dispatch]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFullUser(data);
      } catch (error) {
        console.error(
          "Failed to load user profile:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (
      !orderProcessing &&
      (!cart || !cart.products || cart.products.length === 0)
    ) {
      navigate("/");
    }
  }, [cart, navigate, orderProcessing]);

  const validatePhone = (phone) => {
    if (!phone.startsWith("+91")) {
      phone = "+91" + phone.replace(/^\+91/, ""); // silently add +91
    }
    const phoneWithoutCode = phone.slice(3);
    if (phoneWithoutCode.length !== 10 || !/^\d{10}$/.test(phoneWithoutCode)) {
      setPhoneError("Phone number must be exactly 10 digits after +91");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith("+91")) {
      value = "+91" + value.replace(/^\+91/, "");
    }
    value = "+91" + value.slice(3).replace(/\D/g, "");
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    setShippingAddress({ ...shippingAddress, phone: value });
    validatePhone(value);
  };

  const handlePinCodeChange = async (e) => {
    const pinCode = e.target.value;
    setShippingAddress({ ...shippingAddress, postalCode: pinCode });

    if (pinCode.length === 6 && /^\d{6}$/.test(pinCode)) {
      setAddressLoading(true);
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/pincode/${pinCode}`
        );
        if (
          response.data &&
          response.data[0] &&
          response.data[0].Status === "Success"
        ) {
          const postOffice = response.data[0].PostOffice[0];
          setShippingAddress((prev) => ({
            ...prev,
            city: postOffice.District,
            country: "India",
          }));
        }
      } catch (error) {
        console.error("[ERROR] Error fetching pin code data:", error);
      } finally {
        setAddressLoading(false);
      }
    }
  };

  const handleAddressSelect = (address, index) => {
    setSelectedAddressIndex(index);
    setShippingAddress({
      firstName: "", // Optional: Leave blank or infer from user.name
      lastName: "", // Optional
      address: address.address || "",
      city: address.city || "",
      postalCode: address.postalCode || "",
      country: address.country || "India",
      phone: address.phone?.toString() || "",
    });
    validatePhone(address.phone?.toString() || "");
  };

  const handleCreateOrder = async (e) => {
    if (useNewAddress) {
  await axios.put(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/address`,
    { newAddress: shipping },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
}

    e.preventDefault();
    if (!validatePhone(shippingAddress.phone)) return;
    if (orderInitiated || submitDisabled) return;

    if (cart && cart.products.length > 0) {
      setOrderProcessing(true);
      setSubmitDisabled(true);
      setOrderInitiated(true);

      const shipping = {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
      };

      const orderData = {
        orderItems: cart.products.map((p) => ({
          productId: p.productId,
          name: p.name,
          image: p.image,
          price: p.price,
          quantity: p.quantity,
          size: p.size,
          color: p.color,
          sku: p.sku,
        })),
        shippingAddress: shipping,
        paymentMethod,
        totalPrice: cart.totalPrice,
        idempotencyKey: uuidv4(), // Add idempotency key
      };

      try {
        if (paymentMethod === "cash_on_delivery") {
          const result = await dispatch(createCODOrder(orderData));
          if (result.type === "checkout/createCODOrder/fulfilled") {
            dispatch(clearCart());
            dispatch(clearCheckout());
            setOrderInitiated(false);
            navigate("/order-confirmation", {
              state: {
                order: result.payload,
                paymentMethod: "cash_on_delivery",
              },
            });
          } else {
            console.error("[ERROR] COD Order Creation Failed:", result.error);
            alert(
              result.error?.message ||
                "Failed to create COD order. Please try again."
            );
            setOrderInitiated(false);
          }
        } else {
          const result = await dispatch(createRazorpayOrder(orderData));
          if (result.type === "checkout/createRazorpayOrder/fulfilled") {
            if (result.payload.amount !== cart.totalPrice) {
              alert(
                `A pending order (${result.payload.orderId}) exists with a different amount (₹${result.payload.amount}). Please complete or cancel it.`
              );
              dispatch(clearCheckout());
              setOrderInitiated(false);
              navigate("/order-status", {
                state: { orderId: result.payload.orderId },
              });
            } else {
              setOrderProcessing(false); // Proceed to Razorpay payment
            }
          } else {
            console.error(
              "[ERROR] Razorpay Order Creation Failed:",
              result.error
            );
            alert(
              result.error?.message ||
                "Failed to create Razorpay order. Please try again."
            );
            setOrderInitiated(false);
          }
        }
      } catch (error) {
        console.error("[ERROR] Order creation error:", error);
        alert("Failed to create order. Please try again.");
        setOrderInitiated(false);
      } finally {
        setSubmitDisabled(false);
      }
    }
  };

  const handleRazorpaySuccess = async (paymentData) => {
    try {
      setOrderProcessing(true);
      const result = await dispatch(
        verifyRazorpayPayment({
          razorpayPaymentId: paymentData.razorpay_payment_id,
          razorpayOrderId,
          razorpaySignature: paymentData.razorpay_signature,
          orderId,
        })
      );

      if (result.type === "checkout/verifyRazorpayPayment/fulfilled") {
        dispatch(clearCart());
        dispatch(clearCheckout());
        setOrderInitiated(false);
        navigate("/order-confirmation", {
          state: { order: result.payload.order, paymentMethod: "razorpay" },
        });
      } else {
        console.error("[ERROR] Payment verification failed:", result.error);
        alert(
          result.error?.message ||
            "Payment verification failed. Please contact support."
        );
        setOrderInitiated(false);
      }
    } catch (error) {
      console.error("[ERROR] Payment processing error:", error);
      alert("Payment processing failed. Please contact support.");
      setOrderInitiated(false);
    } finally {
      setOrderProcessing(false);
    }
  };

  const handleRazorpayError = async (errorData) => {
    console.error("[ERROR] Razorpay error:", errorData);
    setOrderProcessing(false);

    try {
      await dispatch(
        handlePaymentFailure({
          razorpayOrderId,
          error_code: errorData.error.code,
          error_description: errorData.error.description,
        })
      );
      alert(
        `Payment failed: ${
          errorData.error.description || "Unknown error"
        }. Please try again.`
      );
      dispatch(clearCheckout());
      setOrderInitiated(false);
    } catch (error) {
      console.error("[ERROR] Failed to handle payment failure:", error);
      alert("Payment failed and status update failed. Please contact support.");
      setOrderInitiated(false);
    }
  };

  const loading = cartLoading || checkoutLoading;
  const error = cartError || checkoutError;

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (
    !orderProcessing &&
    (!cart || !cart.products || cart.products.length === 0)
  ) {
    return <p>Your cart is empty!!</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto py-12 px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 border">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 uppercase tracking-tight">
          Checkout
        </h2>
        <form onSubmit={handleCreateOrder}>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Contact Details
          </h3>
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600"
              disabled
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                required
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Last Name
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                required
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
              />
            </div>
          </div>
          {fullUser?.addresses?.length > 0 && !useNewAddress ? (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">
      Select Saved Address
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fullUser.addresses.map((addr, index) => (
        <div
          key={index}
          className={`border rounded-lg p-4 cursor-pointer ${
            selectedAddressIndex === index
              ? "border-blue-600 bg-blue-50"
              : "hover:border-gray-400"
          }`}
          onClick={() => {
            handleAddressSelect(addr, index);
            setUseNewAddress(false);
          }}
        >
          <p className="text-sm font-medium text-gray-800">
            {fullUser?.name}
          </p>
          <p className="text-sm text-gray-600">{addr.address}</p>
          <p className="text-sm text-gray-600">
            {addr.city}, {addr.postalCode}, {addr.country}
          </p>
          <p className="text-sm text-gray-600">Ph.: {addr.phone}</p>
        </div>
      ))}
    </div>
    <button
      type="button"
      onClick={() => {
        setUseNewAddress(true);
        setSelectedAddressIndex(null);
        setShippingAddress({
          firstName: "",
          lastName: "",
          address: "",
          city: "",
          postalCode: "",
          country: "India",
          phone: "+91",
        });
      }}
      className="mt-4 text-sm text-blue-600 hover:underline"
    >
      + Add New Address
    </button>
  </div>
) : (
  <div className="mb-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Enter New Address
      </h3>
      {fullUser?.addresses?.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setUseNewAddress(false);
            setSelectedAddressIndex(null);
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Cancel
        </button>
      )}
    </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Address</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              required
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                PIN Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  required
                  value={shippingAddress.postalCode}
                  onChange={handlePinCodeChange}
                  placeholder="Enter 6-digit PIN code"
                  maxLength="6"
                  pattern="\d{6}"
                />
                {addressLoading && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">City</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                required
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Country
              </label>
              <select
                className="w-full p-3 border rounded-lg"
                required
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  className={`w-full p-3 border rounded-r-lg ${
                    phoneError ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                  value={shippingAddress.phone.replace("+91", "")}
                  onChange={(e) =>
                    handlePhoneChange({
                      target: { value: "+91" + e.target.value },
                    })
                  }
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                />
              </div>
              {phoneError && (
                <p className="text-sm text-red-600 mt-1">{phoneError}</p>
              )}
            </div>
          </div>
          </div>
)}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Payment Method
            </h3>
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    Online Payment (Razorpay)
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    UPI, Cards, Net Banking, Wallet
                  </span>
                </div>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={paymentMethod === "cash_on_delivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <span className="text-sm font-medium">Cash on Delivery</span>
                  <span className="ml-2 text-xs text-gray-500">
                    Pay when you receive
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-6">
            {!razorpayOrderId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  loading ||
                  orderProcessing ||
                  phoneError ||
                  submitDisabled ||
                  orderInitiated
                }
              >
                {loading || orderProcessing
                  ? "Processing..."
                  : "Continue to Payment"}
              </button>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>
                <RazorpayButton
                  amount={amount}
                  currency={currency}
                  name={`${shippingAddress.firstName} ${shippingAddress.lastName}`}
                  email={user?.email}
                  contact={shippingAddress.phone}
                  orderId={razorpayOrderId}
                  keyId={razorpayKeyId}
                  onSuccess={handleRazorpaySuccess}
                  onError={handleRazorpayError}
                />
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="bg-gray-50 p-8 rounded-xl border shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Order Summary
        </h3>
        <div className="space-y-6">
          {cart?.products?.map((product, index) => (
            <div key={index} className="flex items-start gap-4 border-b pb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-24 object-cover rounded-md border"
              />
              <div className="flex-1">
                <h4 className="text-md font-semibold text-gray-700">
                  {product.name}
                </h4>
                <p className="text-sm text-gray-500">Size: {product.size}</p>
                <p className="text-sm text-gray-500">Color: {product.color}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {product.quantity}
                </p>
              </div>
              <p className="text-lg font-medium text-gray-800">
                ₹{(product.price * product.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2 text-lg text-gray-700">
          <div className="flex justify-between">
            <span>Total Quantity</span>
            <span>
              {cart?.products?.reduce(
                (total, item) => total + item.quantity,
                0
              )}{" "}
              items
            </span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{cart?.totalPrice?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          {paymentMethod === "cash_on_delivery" && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>COD Charges</span>
              <span>₹0</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-4 font-semibold text-gray-900">
            <span>Total</span>
            <span>₹{cart?.totalPrice?.toLocaleString()}</span>
          </div>
        </div>

        {/* {razorpayOrderId && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Payment Method Selected:</h4>
            <p className="text-sm text-blue-700">Online Payment via Razorpay</p>
            <p className="text-xs text-blue-600 mt-1">Order ID: {razorpayOrderId}</p>
            {orderId && (
              <p className="text-xs text-blue-600 mt-1">MongoDB Order ID: {orderId}</p>
            )}
            <button
              onClick={() => navigate("/order-status", { state: { orderId } })}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              View or Cancel Order
            </button>
          </div>
        )} */}

        {orderProcessing && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              <strong>Processing your order...</strong> Please wait.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
