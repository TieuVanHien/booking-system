'use client';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { loginImage } from '../public/images';
import Link from 'next/link';
import '@/styles/login.scss';
import { AuthenticationContext } from '@/context/authentication';

const Login = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const { login } = useContext(AuthenticationContext);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err: any) {
      setLoginError('Invalid username or password');
      console.error('An error occurred during login:', err);
    }
  };

  return (
    <section className="login-page">
      <div className="login flex justify-center items-center">
        <div className="left">
          <Image
            src={loginImage}
            width={450}
            height={450}
            alt="Picture of the author"
          />
        </div>
        <div className="right flex flex-col justify-center items-center">
          <form
            className="flex flex-col justify-center items-center"
            method="POST"
            onSubmit={handleLogin}
          >
            <h3 className="mb-8">Sign In To Your Account</h3>
            <div className="form">
              <div className="flex flex-col">
                <label className="mb-1">Username:</label>
                <input
                  type="text"
                  className="text-black"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter Your Username"
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
          {loginError && <p className="mt-8 font-semibold">{loginError}</p>}
        </div>
      </div>
    </section>
  );
};

export default Login;
