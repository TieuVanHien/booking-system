import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cookie from 'cookie';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }
    if (!req.headers.cookie) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
      const { refresh } = cookie.parse(req.headers.cookie);
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      };
      const body = {
        refresh
      };
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/token/refresh/',
        body,
        config
      );
      if (data && data.access) {
        const accessToken = data.access;
        const userConfig = {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        };
        try {
          const response = await axios.delete(
            `http://127.0.0.1:8000/api/bookings/${bookingId}/delete/`,
            userConfig
          );
          return res.status(200).json(response.data);
        } catch (error: any) {
          console.error('Error deleting booking:', error.message);
          return res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || 'Failed to delete booking'
          });
        }
      } else {
        return res.status(500).json({ message: 'Something went wrong' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Invalid Method' });
  }
};
