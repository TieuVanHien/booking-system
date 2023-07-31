import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Invalid Method' });
  }
  if (req.method === 'POST') {
    const { username, firstname, lastname, email, password } = req.body;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      };
      const body = {
        username,
        first_name: firstname,
        last_name: lastname,
        email,
        password
      };
      try {
        await axios.post('http://127.0.0.1:8000/api/register/', body, config);
        return res.status(201).json({ message: 'Registration successful' });
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          console.error('User with username or email already exists');
        } else {
          console.error('Error occurred:', error);
        }
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        console.error('User with username or email already exist:', err);
        return res.status(400).json({ message: 'Bad Request' });
      } else {
        console.error('Register API error:', err);
        return res.status(500).json({ message: 'Registration Failed' });
      }
    }
  }
};
