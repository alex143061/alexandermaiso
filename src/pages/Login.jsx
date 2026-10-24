import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiLock } from "react-icons/fi";
import { StarsCanvas } from "../components/canvas";
import { usePageMeta } from "../hooks/usePageMeta";
import { useToast } from "../hooks/useToast";
import { Footer, Toast } from "../components";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  usePageMeta({
    title: "Log in | Alexander Maiso (Alex)",
    description:
      "Sign in to the Alexander Maiso portfolio demo area. Access the CRUD project tracker and other developer tools.",
    path: "/login",
    noIndex: true,
  });

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      showToast("error", "Please enter both username and password.");
      return;
    }

    const storedUserData = JSON.parse(sessionStorage.getItem("users"));

    if (!storedUserData || storedUserData.length === 0) {
      showToast("error", "No registered users found. Please register first.");
      return;
    }

    const user = storedUserData.find(
      (user) =>
        user.username.toLowerCase() === username.toLowerCase() &&
        user.password === password
    );

    if (user) {
      showToast("success", "Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      showToast("error", "Invalid credentials. Please try again.");
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden">
      {/* Galaxy background: CSS nebula + animated star field */}
      <div className="fixed inset-0 z-[-1] w-full h-full galaxy-nebula">
        <StarsCanvas fixed />
      </div>

      {/* Toast is portalled to <body> so it renders above the navbar */}
      <Toast toast={toast} position="top-center" />

      <div className="flex items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-120px)]">
        <div className="relative z-10 w-full max-w-[440px] mx-4">
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-teal-500/30">
              <FiUser size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <FiUser size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Username"
                className="w-full h-13 pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-[15px] focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-transparent focus:bg-white/10 transition-all duration-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="relative">
              <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                placeholder="Password"
                className="w-full h-13 pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-[15px] focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-transparent focus:bg-white/10 transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 hover:from-teal-400 hover:via-purple-400 hover:to-orange-400 px-6 py-4 rounded-xl font-bold text-white text-[15px] shadow-lg shadow-teal-500/25 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-teal-500/40 active:translate-y-0 flex items-center justify-center gap-2"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="px-4 text-xs text-gray-500 font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white font-semibold text-[15px] transition-all duration-300"
          >
            <FiUser size={18} />
            Create New Account
          </Link>
        </motion.div>
      </div>
    </div>

    <Footer />
  </div>
  );
};

export default Login;
