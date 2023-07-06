import { Dispatch, SetStateAction, ReactNode } from 'react';

export interface SidebarProps {
  setSelectedLink: Dispatch<SetStateAction<string>>;
}
export interface User {
  username: string;
  email: string;
}

export interface AuthContextType {
  user: string;
  accessToken: string;
  error: string;
  login: (email: string, password: string) => void;
  register: (username: string, email: string, password: string) => void;
}
export interface Props {
  children?: ReactNode;
}
