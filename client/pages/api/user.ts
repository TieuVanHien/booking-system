import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const accessToken = req.headers.authorization?.split(' ')[1];
      if (!accessToken) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const userConfig = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };
      try {
        const { data: userData } = await axios.get(
          'http://127.0.0.1:8000/api/user/',
          userConfig
        );
        console.log(userData);
        res.status(200).json({ user: userData });
      } catch (err) {
        console.error('User data retrieval error:', err);
        res.status(500).json({ message: 'Failed to retrieve user data' });
      }
    } catch (err) {
      console.error('User data API error:', err);
      return res.status(500).json({ message: 'Error retrieving user data' });
    }
  } else {
    res.status(405).json({ message: 'Invalid Method' });
  }
};
