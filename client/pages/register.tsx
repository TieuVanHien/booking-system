'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { login } from '../public/images';
import Link from 'next/link';
import '../styles/register.scss';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: any) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      return;
    }
    if (emailError) {
      setEmailError('');
    }
    try {
      const response = await axios.post('/api/register', {
        username,
        email,
        password
      });

      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        setUsername('');
        setEmail('');
        setPassword('');
        router.push('/login');
      } else {
        // Registration failed
        console.error('Registration failed');
        setError('An error occurred');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An error occurred');
    }
  };

  return (
    <section className="register-page">
      <div className="register flex justify-center items-center">
        <div className="left">
          <Image
            src={login}
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
