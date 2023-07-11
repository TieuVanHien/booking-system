import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('refresh', '', {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
      sameSite: true,
      path: '/'
    })
  );
  res.status(200).json({ message: 'User has been logged out successfully' });
};
