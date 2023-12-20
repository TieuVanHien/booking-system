import React, { useState } from 'react';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import Image from 'next/image';
import { loginImage } from '@/public/images';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ResetPassword = (req: NextApiRequest, res: NextApiResponse) => {
  const [newPassword, setnewPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [validError, setValidError] = useState('');
  const router = useRouter();
  const { uidb64, token } = router.query;

  const validateInput = (password: string) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordPattern.test(password)) {
      setValidError(
        'Password must be at least 8 characters long and contain at least 1 capital letter and 1 number'
      );
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    useEffect(() => {
      if (!uidb64 || !token) {
        router.push('/login');
      }
    }, [uidb64, token]);
    console.log('uidb64:', uidb64);
    console.log('token:', token);
    const validPassword = validateInput(newPassword);
    if (!validPassword) {
      setError('Your password does not match');
      return;
    }
    if (newPassword !== password2) {
      setError('Your password does not match');
      return;
    }
    if (req.method === 'POST') {
      const { newPassword } = req.body;
      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/resetpassword',
          {
            uidb64,
            token,
            newPassword
          }
        );
        console.log(response.data);
        return res.status(200).json({ message: 'Password reset successful' });
      } catch (error: any) {
        console.error('Error:', error.response?.data || error.message);
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  };

  return (
    <section className="register-page">
      <div className="register flex justify-center items-center">
        <div className="left">
          <Image
            src={loginImage}
            width={450}
            height={450}
            alt="Picture of the author"
          />
        </div>
        <form
          method="POST"
          className="right flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <h3 className="mb-6">Create Your Free Account</h3>
          <div className="form">
            <div className="flex flex-col">
              <label className="mb-1">Password:</label>
              <input
                type="password"
                className="text-black"
                value={newPassword}
                onChange={(e) => setnewPassword(e.target.value)}
                placeholder="Enter Your New Password"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1">Confirm Password:</label>
              <input
                type="password"
                className="text-black"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Confirm Password"
              />
            </div>
          </div>
          <button
            className="button bg-yellow-300 hover:bg-yellow-300 text-black font-bold py-2 px-4 border-b-4 border-yellow-600 hover:border-yellow-500 rounded"
            type="submit"
          >
            Change Password
          </button>
          {error && <p className="mt-2">{error}</p>}
          {validError && <p className="mt-4">{validError}</p>}
          <span className="mt-4 text-s">
            Already have an account?
            <Link href="/login" className="ml-1  text-yellow-500">
              Log in
            </Link>
          </span>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
