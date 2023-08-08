'use client';
import React, { useState, useContext } from 'react';
import { AuthenticationContext } from '@/context/authentication';
import Image from 'next/image';
import { loginImage } from '../public/images';
import Link from 'next/link';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [validError, setValidError] = useState('');

  const { register } = useContext(AuthenticationContext);

  const validateInput = (email: string, username: string, password: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernamePattern = /^[a-zA-Z0-9_-]+$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    try {
      if (!emailPattern.test(email)) {
        setValidError('Please enter a valid email');
      }
      if (!usernamePattern.test(username)) {
        setValidError('Please enter a valid username');
      }
      if (!passwordPattern.test(password)) {
        setValidError(
          'Password must be at least 8 characters long and contain at least 1 capital letter and 1 number'
        );
      }
      return true;
    } catch (err) {
      return 'Something went wrong';
    }
  };

  const handleSubmit = async (e: any) => {
    validateInput(username, email, password);
    e.preventDefault();
    if (password !== password2) {
      setError('Your password does not match');
    }
    try {
      register(username, firstname, lastname, email, password);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError('User with username or email already exists');
      } else {
        setError('Something went wrong, please try again!');
      }
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
              <label className="mb-1">Username:</label>
              <input
                type="text"
                className="text-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1">First Name:</label>
              <input
                type="text"
                className="text-black"
                value={firstname}
                required
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1">Last Name:</label>
              <input
                type="text"
                className="text-black"
                value={lastname}
                required
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your username"
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
          {validError && <p className="mt-4">{validError}</p>}
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
