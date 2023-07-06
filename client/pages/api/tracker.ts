import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cookie from 'cookie';

let startTime: number | null = null;
let endTime: number | null = null;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.headers.cookie) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { refresh } = cookie.parse(req.headers.cookie);
    if (!refresh) {
      return res.status(400).json({ message: 'Token is required' });
    }
    try {
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
      const { url } = req.body;
      const trackingConfig = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.access}`
        }
      };
      const trackingBody = {
        url
      };
      const trackingResponse = await axios.post(
        'http://127.0.0.1:8000/api/url-tracker/',
        trackingBody,
        trackingConfig
      );
      const trackingData = trackingResponse.data;
      startTime = 0;
      return res.status(200).json({
        message: 'Tracking started',
        trackingData,
        startTime
      });
    } catch (error) {
      console.log(error);
    }
  }
  if (req.method === 'GET') {
    console.log(startTime);
    if (startTime === null) {
      return res.status(400).json({ message: 'Tracking not started' });
    }
    try {
      const date = new Date();
      endTime = date.getHours();
      console.log(endTime, startTime);
      const duration = endTime - startTime; // Convert to hours
      console.log(duration);
      res.status(200).json({ duration });
    } catch (error) {
      console.error('Failed to retrieve duration:', error);
      res.status(500).json({ message: 'Failed to retrieve duration' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
