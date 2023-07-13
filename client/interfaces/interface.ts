import { Dispatch, SetStateAction, ReactNode } from 'react';

export interface SidebarProps {
  setSelectedLink: Dispatch<SetStateAction<string>>;
}
export interface UserProps {
  username: string;
  email: string;
}

export interface AuthContextType {
  user: null | string;
  accessToken: null | string;
  error: string;
  login: (email: string, password: string) => void;
  register: (username: string, email: string, password: string) => void;
  checkUserLogin: () => void;
  logout: () => void;
}
export interface Props {
  children?: ReactNode;
}

export interface Service {
  id: number;
  name: string | null;
  duration: number | null;
  serviceId: number | null;
}

export interface NewEvent {
  title: string;
  start: Date | null;
  end: Date | null;
}
