"use client";
import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        // Registration successful
        console.log(response.data);
      } else {
        // Registration failed
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <form method="POST" onSubmit={handleSubmit}>
      {/* Form inputs */}
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" onClick={handleSubmit}>
        Register
      </button>

      {error && <p>{error}</p>}
    </form>
  );
};

export default RegisterPage;
