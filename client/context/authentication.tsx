import React, { ReactNode, createContext, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface AuthContextType {
  user: string;
  accessToken: string;
  error: string;
  login: (email: string, password: string) => void;
  register: (username: string, email: string, password: string) => void;
}
interface Props {
  children?: ReactNode;
}

export const AuthenticationContext = createContext<AuthContextType>({
  user: '',
  accessToken: '',
  error: '',
  login: () => {},
  register: () => {}
});
export const AuthenticationProvider = ({ children }: Props) => {
  const [user, setUser] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  //create next.js api for login
  const login = async (username: string, password: string) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    };
    const body = {
      username,
      password
    };
    try {
      const { data: accessResponse } = await axios.post(
        'http://localhost:3000/api/login',
        body,
        config
      );
      if (accessResponse && accessResponse.user) {
        setUser(accessResponse.user);
      }
      if (accessResponse && accessResponse.access) {
        setAccessToken(accessResponse.access);
      }
      router.push('/user');
    } catch (err: any) {
      console.log(err);
    }
  };
  //create next.js api for registration
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    };
    const body = {
      username,
      email,
      password
    };
    try {
      await axios.post('http://localhost:3000/api/register', body, config);
      router.push('/login');
    } catch (err: any) {
      console.log(err);
    }
  };
  const authContextValue: AuthContextType = {
    user,
    accessToken,
    error,
    login,
    register
  };

  return (
    <AuthenticationContext.Provider value={authContextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
