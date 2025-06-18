import React, { useState } from "react";
import { Link } from "react-router-dom";
import login from "../assets/login.jpg";
import logo from "../assets/logo1.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Login: ",{email, password});
    
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="login-logo" className="w-28" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome Back! 👋
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Enter your username and password to login
          </p>

          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-semibold mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Enter your email address"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white p-2.5 rounded-lg font-semibold hover:opacity-90 transition duration-300"
          >
            Sign In
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-sky-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>

      {/* Right image */}
      <div className="hidden md:block w-1/2">
        <div className="h-[90vh] flex items-center justify-center">
          <img
            src={login}
            alt="login-image"
            className="h-full w-full object-cover rounded-l-3xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
