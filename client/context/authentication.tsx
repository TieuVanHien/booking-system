import React, { ReactNode, createContext, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface AuthContextType {
  user: string;
  accessToken: string;
  error: string;
  login: (email: string, password: string) => void;
}

interface Props {
  children?: ReactNode;
}

export const AuthenticationContext = createContext<AuthContextType>({
  user: '',
  accessToken: '',
  error: '',
  login: () => {}
});

export const AuthenticationProvider = ({ children }: Props) => {
  const [user, setUser] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

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
    const { data } = await axios.post(
      'http://localhost:3000/api/login',
      body,
      config
    );
  };
  const authContextValue: AuthContextType = {
    user,
    accessToken,
    error,
    login
  };

  return (
    <AuthenticationContext.Provider value={authContextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
