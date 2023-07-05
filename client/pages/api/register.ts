import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Invalid Method' });
  }
  if (req.method === 'POST') {
    const { username, email, password } = req.body;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      };
      const body = {
        username,
        email,
        password
      };
      try {
        await axios.post('http://127.0.0.1:8000/api/register/', body, config);
      } catch (error) {
        console.log('Error occured', error);
      }
      return res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
      console.error('Register API error:', err);
      return res.status(500).json({ message: 'Registration Failed' });
    }
  }
};
