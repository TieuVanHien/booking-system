import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { loginImage } from '@/public/images';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ResetPassword = () => {
  const [newPassword, setnewPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [validError, setValidError] = useState('');
  const router = useRouter();
  const { uidb64, token } = router.query;
  useEffect(() => {
    if (!uidb64 || !token) {
      console.log('uidb64 and token are not found');
    }
  }, [uidb64, token, router]);
  console.log('data:', uidb64, token);
  const validateInput = (password: string) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordPattern.test(password)) {
      return false;
    }
    return true;
  };
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const validPassword = validateInput(newPassword);
    if (!validPassword) {
      setError(
        'Password must be at least 8 characters long and contain at least 1 capital letter and 1 number'
      );
      return;
    }
    if (newPassword !== password2) {
      setError('Your password does not match');
      return;
    }
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/resetpassword/${uidb64}/${token}/`,
        {
          newPassword
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        router.push('/login');
      }
    } catch (error: any) {
      console.error('Error:', error.response?.data || error.message);
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
          <h3 className="mb-6">Reset Your Password</h3>
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
            Go Back To Login Page?
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
