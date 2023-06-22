"use client";
import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        username,
        password,
        email,
      });

      // Handle the successful registration response
      console.log(response.data);
    } catch (error: any) {
      // Handle registration error
      setError(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
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

      <button type="submit">Register</button>

      {error && <p>{error}</p>}
    </form>
  );
};

export default RegisterPage;
