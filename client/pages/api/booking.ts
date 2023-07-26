import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cookie from 'cookie';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Invalid Method' });
  }
  if (req.method == 'POST') {
    const userId = 22;
    const { title, service, duration, start, end } = req.body;
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
        const userConfig = {
          headers: {
            Authorization: 'Bearer ' + data.access
          }
        };
        const { data: userData } = await axios.get(
          'http://127.0.0.1:8000/api/user/',
          userConfig
        );
        res.status(200).json({ user: userData, access: userData.access });
      } else {
        res.status(500).json({ message: 'Something went wrong' });
      }
      try {
        const accessToken = data.access;
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
      } catch (error: any) {
        console.log(error.message);
      }
    } catch (err) {
      console.log(err);
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
