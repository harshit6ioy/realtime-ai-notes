import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", formData);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (error) {
      alert(error?.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-amber-50 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-10 rounded-2xl w-full max-w-md shadow-lg border-2 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Welcome Back
        </h2>

        {/* EMAIL */}
        <div className="mb-6">
          <label className="block font-bold mb-2 text-gray-700 dark:text-gray-200">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            className="w-full p-3.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-8">
          <label className="block font-bold mb-2 text-gray-700 dark:text-gray-200">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="••••••••"
            className="w-full p-3.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-lg font-bold transition shadow-md"
        >
          Login
        </button>

        {/* LINK */}
        <p className="text-center mt-6 font-bold text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-700 transition"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;