import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Invalid Method' });
  }
  if (req.method == 'POST') {
    const { userId, title, service, duration, start, end } = req.body;
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: 'Access token is missing or invalid' });
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    };
    const body = {
      title,
      service,
      duration,
      start,
      end
    };
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/users/${userId}/bookings/`,
        body,
        config
      );
      console.log(response.data);
      return res.status(201).json(response.data);
    } catch (error: any) {
      console.error('Error creating booking:', error.message);
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/users/${userId}/bookings/`
      );

      return res.status(200).json(response.data);
    } catch (error: any) {
      console.error('Error retrieving bookings:', error.message);
      return res.status(error.response?.status || 500).json({
        message: error.response?.data?.message || 'Failed to retrieve bookings'
      });
    }
  } else {
    return res.status(405).json({ message: 'Invalid Method' });
  }
};
