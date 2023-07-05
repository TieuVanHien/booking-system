'use client';
import React, { useState, useContext } from 'react';
import { AuthenticationContext } from '@/context/authentication';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { loginImage } from '../public/images';
import Link from 'next/link';
import '../styles/register.scss';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [emailError, setEmailError] = useState('');

  const { register } = useContext(AuthenticationContext);

  const validateEmail = (email: any) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };
  const handleSubmit = async (e: any) => {
    validateEmail(e);
    e.preventDefault();
    if (password !== password2) {
      setError('Your password does not match');
    }
    register(username, email, password);
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
              <label className="mb-1">Username:</label>
              <input
                type="text"
                className="text-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your Username"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1">Email:</label>
              <input
                type="text"
                className="text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
              />
            </div>
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
            Create Account
          </button>
          {error && <p className="mt-2">{error}</p>}
          {emailError && <p className="mt-2">{emailError}</p>}
          <span className="mt-4 text-xs">
            Already have an account?
            <Link href="/login" className="ml-1 text-yellow-500">
              Log in
            </Link>
          </span>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
