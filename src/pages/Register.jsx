import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Retrieve existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Save the new user registration data
    existingUsers.push({ username, email, password });

    // Store the updated array of users in localStorage
    localStorage.setItem("users", JSON.stringify(existingUsers));

    // Redirect to login page after successful registration
    navigate("/login");
  };

  return (
    <div className="w-full min-h-screen bg-primary text-white flex flex-col items-center justify-center -mt-24">
      <h1 className="text-4xl font-bold mb-4">Register</h1>
      <form className="flex flex-col gap-4 w-80" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          className="p-2 rounded text-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="p-2 bg-purple-600 rounded font-bold">
          Register
        </button>
      </form>
      <p className="mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-purple-400">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
