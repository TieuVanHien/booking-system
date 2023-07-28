import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  AuthContextType,
  Props
  // Booking,
  // BookingContextType
} from '@/interfaces/interface';

export const AuthenticationContext = createContext<AuthContextType>({
  user: null,
  accessToken: '',
  error: '',
  login: () => {},
  register: () => {},
  checkUserLogin: () => {},
  logout: () => {}
});
export const AuthenticationProvider = ({ children }: Props) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState('');

  const router = useRouter();
  useEffect(() => {
    checkUserLogin();
  }, []);
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
  const register = async (
    username: string,
    firstname: string,
    lastname: string,
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
      firstname,
      lastname,
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
  const checkUserLogin = async (): Promise<void> => {
    try {
      const { data } = await axios.post('http://localhost:3000/api/user');
      setUser(data.user);
      setAccessToken(data.access);
    } catch (err) {
      console.log(err);
    }
  };
  const logout = async (): Promise<void> => {
    try {
      await axios.post('http://localhost:3000/api/logout');
      setUser(null);
      setAccessToken(null);
      router.push('/home');
    } catch (err: any) {
      console.log(err);
    }
  };
  const authContextValue: AuthContextType = {
    user,
    accessToken,
    error,
    login,
    register,
    checkUserLogin,
    logout
  };
  return (
    <AuthenticationContext.Provider value={authContextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
