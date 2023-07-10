import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AuthContextType, Props } from '@/interfaces/interface';

export const AuthenticationContext = createContext<AuthContextType>({
  user: '',
  accessToken: '',
  error: '',
  login: () => {},
  register: () => {},
  checkUserLogin: () => {}
});
export const AuthenticationProvider = ({ children }: Props) => {
  const [user, setUser] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  useEffect(() => {
    checkUserLogin();
  }, []);
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
      console.log(accessResponse);
      console.log(accessResponse.user.is_staff);
      if (accessResponse && accessResponse.user) {
        setUser(accessResponse.user);
      }
      if (accessResponse && accessResponse.access) {
        setAccessToken(accessResponse.access);
        localStorage.setItem('accessToken', accessResponse.access);
      }
      if (accessResponse.user.is_staff === true) {
        router.push('/admin');
      } else {
        router.push('/user');
      }
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
  // keep user logged in
  const checkUserLogin = async (): Promise<void> => {
    try {
      const { data } = await axios.post('http://localhost:3000/api/user');
      setUser(data.user);
      setAccessToken(data.access);
    } catch (err) {
      console.log(err);
    }
  };

  const authContextValue: AuthContextType = {
    user,
    accessToken,
    error,
    login,
    register,
    checkUserLogin
  };
  return (
    <AuthenticationContext.Provider value={authContextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
