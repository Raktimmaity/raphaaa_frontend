import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/login.jpg";
import logo from "../assets/logo1.png";
import { loginUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergecart } from "../redux/slices/cartSlice";
import { toast } from "sonner"; // ✅ Sonner import

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState({});
  const canvasRef = useRef(null);
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

  useEffect(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ a, b, answer: a + b });
  }, []);

  useEffect(() => {
    if (canvasRef.current && captchaQuestion.a !== undefined) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = 100;
      canvasRef.current.height = 40;

      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, 100, 40);

      // Add random lines for scratch effect
      for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = `rgba(0,0,0,${Math.random()})`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * 100, Math.random() * 40);
        ctx.lineTo(Math.random() * 100, Math.random() * 40);
        ctx.stroke();
      }

      ctx.font = "bold 16px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(`${captchaQuestion.a} + ${captchaQuestion.b} = ?`, 10, 25);
    }
  }, [captchaQuestion]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || !captchaAnswer) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
      toast.error("Captcha is incorrect");
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex h-[80vh]">
      <div className="w-full md:w-full flex flex-col justify-center items-center p-6 sm:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center w-fit">
              <h2 className="text-3xl font-bold text-gray-800">Login</h2>{" "}
              <span className="h-1 w-16 ml-3 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"></span>
            </div>
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

          <div className="mb-5">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Enter your password"
            />
          </div>

          {/* ✅ Captcha Field with Canvas Image */}
          <div className="mb-6 flex items-center gap-3">
            <canvas ref={canvasRef} className="rounded shadow-sm" />
            <input
              type="text"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Answer"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white p-2.5 rounded-lg font-semibold hover:opacity-90 transition duration-300"
          >
            {loading ? "Signing..." : "Sign In"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-sky-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
