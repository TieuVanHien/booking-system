import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    const response = await axios.post(
      'http://127.0.0.1:8000/api/forgotpassword/',
      {
        email: email
      }
    );
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    return res
      .status(error.response?.status || 500)
      .json({ error: 'Internal Server Error' });
  }
};
