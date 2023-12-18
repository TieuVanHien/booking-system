import React from 'react';
import { useState, useContext } from 'react';
import Image from 'next/image';
import { loginImage } from '@/public/images';
import Link from 'next/link';
import { AuthenticationContext } from '@/context/authentication';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState<string>('');
  const { forgotPassword } = useContext(AuthenticationContext);
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      console.log('Password reset link was sent');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section className="forgot-page">
      <div className="forgot flex justify-center items-center">
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
              <label className="mb-1">Email:</label>
              <input
                type="text"
                className="text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>
          <button
            className="button bg-yellow-300 hover:bg-yellow-300 text-black font-bold py-2 px-4 border-b-4 border-yellow-600 hover:border-yellow-500 rounded"
            type="submit"
          >
            Reset Password
          </button>
          <span className="mt-8 text-s">
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

export default ForgotPasswordForm;
