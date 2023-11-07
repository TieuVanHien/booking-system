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
      } else {
        res.status(500).json({ message: 'Something went wrong' });
      }
    } catch (err) {
      res
        .status(401)
        .json({ message: 'Wrong username or password or invalid account' });
    }
  } else if (req.method === 'GET') {
    const { refresh } = req.cookies;
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
      if (data && data.access) {
        const userConfig = {
          headers: {
            Authorization: `Bearer ${data.access}`
          }
        };
        const { data: userData } = await axios.get(
          'http://127.0.0.1:8000/api/user/',
          userConfig
        );
        res.status(200).json({ user: userData });
      } else {
        res.status(500).json({ message: 'Something went wrong' });
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: 'Error occurred while fetching user data' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};
