import { Dispatch, SetStateAction, ReactNode } from 'react';

export interface SidebarProps {
  setSelectedLink: Dispatch<SetStateAction<string>>;
}
export interface UserProps {
  username: string;
  email: string;
}

export interface AuthContextType {
  user: string;
  accessToken: string;
  error: string;
  login: (email: string, password: string) => void;
  register: (username: string, email: string, password: string) => void;
  checkUserLogin: () => void;
}
export interface Props {
  children?: ReactNode;
}
