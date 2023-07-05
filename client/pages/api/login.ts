import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let accessToken = null;
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Invalid Method' });
  }
  if (req.method === 'POST') {
    const { username, password } = req.body;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      };
      const body = {
        username,
        password
      };
      const { data: accessResponse } = await axios.post(
        'http://127.0.0.1:8000/api/token/',
        body,
        config
      );
      accessToken = accessResponse.access;
      console.log(accessToken);
      if (accessToken) {
        const userConfig = {
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        };
        try {
          const { data: userData } = await axios.get(
            'http://127.0.0.1:8000/api/user/',
            userConfig
          );
          console.log(userData);
          res.status(200).json({ user: userData, access: accessToken });
        } catch (err) {
          console.error('User data retrieval error:', err);
        }
      }
    } catch (err) {
      console.error('Login API error:', err);
      return res.status(500).json({ message: 'Login Failed' });
    }
  }
};
