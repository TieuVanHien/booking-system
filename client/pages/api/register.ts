import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { username, email, password } = req.body;
  try {
    // Send a POST request to Django server
    const response = await fetch('http://127.0.0.1:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        username
      })
    });
    const data = await response.json();
    if (response.status === 200 || response.status === 201) {
      console.log(data); // Log the response data
      return res.status(200).json(data);
    } else {
      console.log(data); // Log the response data
      return res.status(500).json({ message: 'Registration failed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Registration failed' });
  }
}
