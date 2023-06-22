import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, email, password } = req.body;

  // Perform validation and check if the username is already taken
  // Replace this with your own validation logic (e.g., database check)

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Save the username and hashed password to your database or storage

  res.status(201).json({ message: "Registration successful" });
}
