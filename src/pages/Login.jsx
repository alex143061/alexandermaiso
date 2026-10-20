import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiMail, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { StarsCanvas } from "../components/canvas";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (toast) setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

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
    <div className="relative w-full min-h-screen bg-primary/70 text-white p-4 sm:p-8 flex items-center justify-center overflow-hidden">
      <div className="fixed inset-0 z-[-1] w-full h-full">
        <StarsCanvas fixed />
      </div>

      {/* Toast (outside z-10 container so it renders above the navbar) */}
      {toast && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border ${
            toast.type === "success"
              ? "bg-emerald-500/90 text-white border-emerald-300"
              : "bg-rose-500/90 text-white border-rose-300"
          } flex items-center gap-3`}
        >
          {toast.type === "success" ? (
            <FiCheckCircle size={20} />
          ) : (
            <FiAlertCircle size={20} />
          )}
          <span className="font-medium text-sm">{toast.message}</span>
        </motion.div>
      )}

      <div className="relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30">
            <FiUser size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <FiUser size={20} className="absolute left-4 top-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Username"
              className="pl-11 p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <FiLock size={20} className="absolute left-4 top-3.5 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              className="pl-11 p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 hover:from-teal-400 hover:via-purple-400 hover:to-orange-400 px-6 py-4 rounded-xl font-bold text-white shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-1 hover:shadow-teal-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-400 hover:text-teal-300 transition-colors font-medium">
            Register here
          </Link>
        </p>
      </motion.div>
      </div>
    </div>
  );
};

export default Login;
