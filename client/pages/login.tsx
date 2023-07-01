'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { login } from '../public/images';
import Link from 'next/link';
import '../styles/login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: any) => {
    e.preventDefault();
    console.log('Login');
    try {
      const res = await fetch('api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      if (res.status === 200) {
        router.push('/user');
      } else {
        setLoginError('Invalid email or password'); // Set error message
      }
    } catch (err) {
      console.log('Error: ', err);
      setLoginError('Error occurred'); // Set error message
    }
  };

  return (
    <section className="login-page">
      <div className="login flex justify-center items-center">
        <div className="left">
          <Image src={login} width={450} height={450} alt="login page image" />
        </div>
        <form
          method="POST"
          className="right flex flex-col items-center"
          onSubmit={handleLogin}
        >
          <h3 className="mb-8">Sign In To Your Account</h3>
          <div className="form">
            <div className="flex flex-col">
              <label className="mb-1">Email:</label>
              <input
                type="text"
                className="text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1">Password:</label>
              <input
                type="password"
                className="text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
              />
            </div>
          </div>
          <button
            className="button bg-yellow-300 hover:bg-yellow-300 text-black font-bold py-2 px-4 border-b-4 border-yellow-600 hover:border-yellow-500 rounded mt-18"
            type="submit"
          >
            Sign In
          </button>
          {loginError && <p className="mt-4">{loginError}</p>}
          <div
            className="mt-4
           text-xs flex justify-around items-center"
          >
            <span className="mt-4 mr-16">
              <Link
                href="/register"
                className="ml-1 text-yellow-500 hover:text-yellow-700"
              >
                Sign Up{' '}
              </Link>
              For New Account
            </span>
            <Link
              className="mt-4 ml-12 hover:text-yellow-500"
              href="/forgotpassword"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
