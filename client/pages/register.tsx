"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/register", {
        username,
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        setUsername("");
        setEmail("");
        setPassword("");
        router.push("/login");
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
          className="text-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="text"
          className="text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          className="text-black"
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
