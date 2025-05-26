import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Add Link import

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple validation for empty fields
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    // Retrieve stored users data from localStorage
    const storedUserData = JSON.parse(localStorage.getItem("users"));

    console.log("Stored User Data:", storedUserData); // Debugging

    if (!storedUserData || storedUserData.length === 0) {
      // If no user data is found in localStorage
      alert("No registered users found. Please register first.");
      return;
    }

    // Search for a matching user
    const user = storedUserData.find(
      (user) =>
        user.username.toLowerCase() === username.toLowerCase() &&
        user.password === password
    );

    if (user) {
      // Redirect to Dashboard if login is successful
      console.log("Login successful, navigating to dashboard...");
      navigate("/dashboard");
    } else {
      // Show error if credentials are incorrect
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-primary text-white flex flex-col items-center justify-center -mt-24">
      <h1 className="text-4xl font-bold mb-4">Login</h1>
      <form className="flex flex-col gap-4 w-80" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          className="p-2 rounded text-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="p-2 bg-purple-600 rounded font-bold">
          Login
        </button>
      </form>
      <p className="mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-teal-400">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
