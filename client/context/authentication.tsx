import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AuthContextType, Props } from '@/interfaces/interface';

export const AuthenticationContext = createContext<AuthContextType>({
  user: null,
  accessToken: '',
  error: '',
  login: () => {},
  register: () => {},
  checkUserLogin: () => {},
  logout: () => {},
  forgotPassword: () => {}
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
    } catch (error: any) {
      throw { statusCode: 401, message: 'Invalid username or password' };
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
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/forgotpassword`,
        { email }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  };
  const authContextValue: AuthContextType = {
    user,
    accessToken,
    error,
    login,
    register,
    forgotPassword,
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
