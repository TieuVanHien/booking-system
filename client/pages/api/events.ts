import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cookie from 'cookie';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
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
        try {
          const accessToken = data.access;
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`
            }
          };
          try {
            const response = await axios.get(
              'http://127.0.0.1:8000/bookings/',
              config
            );
            const events = response.data;
            res.status(200).json(events);
          } catch (error: any) {
            console.error('Error fetching events:', error.message);
            res.status(error.response?.status || 500).json({
              message: error.response?.data?.message || 'Failed to fetch events'
            });
          }
        } catch (error: any) {
          console.log(error.message);
        }
      } else {
        res.status(500).json({ message: 'Something went wrong' });
      }
    } catch (err) {
      console.log(err);
    }
  } else if (req.method === 'GET') {
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
        const eventsConfig = {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        };
        try {
          const response = await axios.get(
            'http://127.0.0.1:8000/bookings/',
            eventsConfig
          );
          const events = response.data;
          res.status(200).json(events);
        } catch (error: any) {
          console.error('Error fetching events:', error.message);
          res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || 'Failed to fetch events'
          });
        }
      } else {
        res.status(500).json({ message: 'Something went wrong' });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(405).json({ message: 'Invalid Method' });
  }
};
