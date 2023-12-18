'use client';
import React, { useState, useContext } from 'react';
import { AuthenticationContext } from '@/context/authentication';
import Image from 'next/image';
import { loginImage } from '@/public/images';
import Link from 'next/link';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [validError, setValidError] = useState('');

  const validateInput = (password: string) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    try {
      if (!passwordPattern.test(password)) {
        setValidError(
          'Password must be at least 8 characters long and contain at least 1 capital letter and 1 number'
        );
        return false;
      }
    } catch (err) {
      return 'Something went wrong';
    }
  };

  const handleSubmit = async (e: any) => {
    validateInput(password);
    e.preventDefault();
    if (password !== password2) {
      setError('Your password does not match');
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Password"
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
