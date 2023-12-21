import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { uidb64, token, newPassword } = req.body;
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/resetpassword/',
        {
          uidb64,
          token,
          newPassword
        }
      );
      return res.status(200).json(response.data);
    } catch (error: any) {
      console.error('Error:', error.response?.data || error.message);
      return res
        .status(error.response?.status || 500)
        .json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
