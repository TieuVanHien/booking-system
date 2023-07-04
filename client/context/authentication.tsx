import React, { ReactNode, createContext, useState } from 'react';
import { useRouter } from 'next/router';

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

  const login = async (email: string, password: string) => {
    console.log({ email, password });
    console.log('login context');
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
