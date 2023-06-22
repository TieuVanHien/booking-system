"use client";
import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/register",
        JSON.stringify({
          username,
          password,
          email,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            bodyParser: false,
          },
        }
      );

      // Handle the successful registration response
      console.log(response.data);
      setError("Registration successful");
    } catch (error: any) {
      // Handle registration error
      setError(error.response);
    }
  };

  return (
    <form method="POST" onSubmit={handleRegister}>
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

      <button type="submit" onClick={handleRegister}>
        Register
      </button>

      {error && <p>{error}</p>}
    </form>
  );
};

export default RegisterPage;
