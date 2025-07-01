import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import register from "../assets/register.jpg";
import logo from "../assets/logo1.png";
import { registerUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector  } from "react-redux";
import { mergecart } from "../redux/slices/cartSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {user, guestId, loading} = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // Get redirect parameter and check if it's checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if(user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergecart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        })
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("User registered: ",{name, email, password});
    dispatch(registerUser({ name, email, password }));
  }

  return (
    // <div className="flex min-h-screen">
    <div className="flex h-[80vh]">
      {/* Left form */}
      {/* <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12"> */}
      <div className="w-full md:w-full flex flex-col justify-center items-center p-6 sm:p-12">
        {/* <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200"> */}
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8">
          {/* <div className="flex justify-center mb-6">
            <img src={logo} alt="register-logo" className="w-28" />
          </div> */}
          {/* <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Create Account
          </h2> */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center w-fit">
              <h2 className="text-3xl font-bold text-gray-800">Register</h2>{" "}
              <span className="h-1 w-16 ml-3 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"></span>
            </div>
          </div>
          {/* <p className="text-center text-gray-500 mb-8 text-sm">
            Enter your details to register a new account
          </p> */}

          <div className="mb-5">
            {/* <label htmlFor="name" className="block text-sm font-semibold mb-1 text-gray-700">
              Name
            </label> */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-5">
            {/* <label htmlFor="email" className="block text-sm font-semibold mb-1 text-gray-700">
              Email
            </label> */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Enter your email address"
            />
          </div>

          <div className="mb-6">
            {/* <label htmlFor="password" className="block text-sm font-semibold mb-1 text-gray-700">
              Password
            </label> */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white p-2.5 rounded-lg font-semibold hover:opacity-90 transition duration-300"
          >
            { loading ? "Registering..." : "Register"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-sky-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* Right image */}
      {/* <div className="hidden md:block w-1/2">
        <div className="h-[100vh] flex items-center justify-center">
          <img
            src={register}
            alt="register-image"
            className="h-full w-full object-cover rounded-l-3xl"
          />
        </div>
      </div> */}
    </div>
  );
};

export default Register;
