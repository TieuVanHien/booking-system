import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cookie from 'cookie';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.body;
  const { id, service, start, duration, phone, status, end, title } = data;
  console.log(data);
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Invalid Method' });
  }
  if (!req.headers.cookie) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  if (req.method === 'POST') {
    try {
      const { refresh } = cookie.parse(req.headers.cookie);
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      };
      const body = {
        refresh: refresh
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
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        };
        const requestBody = {
          id,
          title,
          service,
          duration,
          start,
          end,
          phone,
          status
        };
        console.log(requestBody);
        try {
          const response = await axios.patch(
            `http://127.0.0.1:8000/api/bookings/${id}/update/`,
            requestBody,
            userConfig
          );
          console.log(response.data);
          res.status(200).json(response.data);
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Error updating bookings' });
        }
      }
    } catch (error: any) {
      console.log('Error:', error);
    }
  }
};
