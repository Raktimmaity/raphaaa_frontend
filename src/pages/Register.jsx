import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import register from "../assets/register.jpg";
import logo from "../assets/logo1.png";
import { registerUser, googleLoginSuccess } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergecart } from "../redux/slices/cartSlice";
import { toast } from "sonner"; // ✅ Sonner toast
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("Weak");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergecart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  // ✅ Password strength calculator
  useEffect(() => {
    const calculateStrength = () => {
      let strength = 0;
      if (password.length >= 6) strength += 20;
      if (/[A-Z]/.test(password)) strength += 20;
      if (/[a-z]/.test(password)) strength += 20;
      if (/\d/.test(password)) strength += 20;
      if (/[@$!%*?&]/.test(password)) strength += 20;

      setPasswordStrength(strength);

      if (strength < 40) {
        setStrengthLabel("Weak");
      } else if (strength < 80) {
        setStrengthLabel("Medium");
      } else {
        setStrengthLabel("Strong");
      }
    };
    calculateStrength();
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) return toast.error("Enter a valid email");
    if (!password.trim()) return toast.error("Password is required");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="flex h-[80vh]">
      <div className="w-full md:w-full flex flex-col justify-center items-center p-6 sm:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center w-fit">
              <h2 className="text-3xl font-bold text-gray-800">Register</h2>{" "}
              <span className="h-1 w-16 ml-3 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"></span>
            </div>
          </div>

          <div className="mb-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Enter your email address"
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Enter your password"
            />
          </div>

          {/* ✅ Password Strength Meter */}
          {password.length > 0 && (
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Strength: {strengthLabel}
              </span>
              <div className="w-2/3 h-2 rounded-full bg-gray-200 overflow-hidden ml-3">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${passwordStrength}%`,
                    background:
                      passwordStrength < 40
                        ? "linear-gradient(to right, #f87171, #ef4444)"
                        : passwordStrength < 80
                        ? "linear-gradient(to right, #facc15, #fbbf24)"
                        : "linear-gradient(to right, #4ade80, #22c55e)",
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* ✅ Confirm Password Field */}
          <div className="mb-6">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white p-2.5 rounded-lg font-semibold hover:opacity-90 transition duration-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gradient-to-r from-blue-600 to-sky-400" />
            <span className="mx-3 text-gray-600 text-sm font-medium">or</span>
            <div className="flex-grow h-px bg-gradient-to-r from-sky-400 to-blue-600" />
          </div>

          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const decoded = jwtDecode(credentialResponse.credential);
                  const { name, email, picture } = decoded;

                  const { data } = await axios.post(
                    `${
                      import.meta.env.VITE_BACKEND_URL
                    }/api/users/google-login`,
                    { name, email, photo: picture }
                  );

                  dispatch(
                    googleLoginSuccess({ user: data.user, token: data.token })
                  );

                  toast.success("Login successful!");
                  navigate(redirect);
                } catch (error) {
                  console.error(error);
                  toast.error(error.response?.data?.message || "Login failed");
                }
              }}
              onError={() => toast.error("Login failed")}
            />
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-sky-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
