import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000'; // Replace this with your backend URL

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Invalid Method' });
  }
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
      `${BASE_URL}/api/user/${userId}/bookings/`,
      body,
      config
    );
    return res.status(201).json(response.data);
  } catch (error: any) {
    console.error('Error creating booking:', error.message);
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Failed to create booking'
    });
  }
};
