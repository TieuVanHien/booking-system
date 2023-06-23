import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  } else {
    const { username, email, password } = req.body;
    try {
      // Send a POST request to your Django server
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        const data = response.data;
        return res.status(200).json(data);
      } else {
        return res.status(500).json({ message: "Registration failed" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Registration failed" });
    }
  }
}
