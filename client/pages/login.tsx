"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    console.log("Login");
    try {
      const res = await fetch("api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (res.status === 200) {
        router.push("/home");
      } else {
        setLoginError("Invalid email or password"); // Set error message
      }
    } catch (err) {
      console.log("Error: ", err);
      setLoginError("Error occurred"); // Set error message
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" onClick={handleLogin}>
          Login
        </button>
      </form>
      {loginError && <p>{loginError}</p>}
    </div>
  );
};

export default Login;
