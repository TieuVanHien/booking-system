import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Invalid Method" });
  }
  if (req.method == "POST") {
    const { email, password } = req.body;
    console.log("Login request received with email:", email);
    try {
      console.log("Before axios.post");
      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login API response:", response.data);
      if (response.status === 200) {
        return res.status(200).json(response.data);
      } else {
        return res.status(500).json({ message: "Login Failed" });
      }
    } catch (err) {
      console.error("Login API error:", err);
      return res.status(500).json({ message: "Login Failed" });
    }
  }
}
