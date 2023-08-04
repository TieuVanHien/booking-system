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
      try {
        const { data: accessResponse } = await axios.post(
          'http://127.0.0.1:8000/api/token/',
          body,
          config
        );
        accessToken = accessResponse.access;
        if (accessToken) {
          if (accessResponse) {
            res.setHeader(
              'Set-Cookie',
              cookie.serialize('refresh', accessResponse.refresh, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 24,
                path: '/',
                sameSite: 'strict'
              })
            );
          }
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
            res.status(200).json({
              message: 'Login successful',
              user: userData,
              access: accessToken
            });
          } catch (err) {
            res
              .status(401)
              .json({ message: 'Error retrieving user information' });
            console.error('User data retrieval error:', err);
          }
        }
      } catch (error: any) {
        console.log('Error occured', error);
      }
    } catch (err) {
      console.error('Login API error:', err);
      return res.status(401).json({ message: 'Login Failed' });
    }
  }
};
