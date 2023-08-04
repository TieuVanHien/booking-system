import { Dispatch, SetStateAction, ReactNode } from 'react';

export interface SidebarProps {
  setSelectedLink: Dispatch<SetStateAction<string>>;
}
export interface UserProps {
  username: string;
  email: string;
  id: number;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

export interface ModalComponentProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
export interface AuthContextType {
  user: UserProps | null;
  accessToken: null | string;
  error: string;
  login: (email: string, password: string) => void;
  register: (
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ) => void;
  checkUserLogin: () => void;
  logout: () => void;
}
export interface Props {
  children?: ReactNode;
}

export interface Service {
  id: number;
  name: string;
  duration: number;
}

export interface NewEvent {
  id: number;
  title: string;
  service: string | null;
  phone: string;
  duration: number;
  start: Date;
  end: Date;
  status: string | null;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface Booking {
  id: number;
  title: string;
  service: string | null;
  duration: number;
  start: Date;
  end: Date;
}

export interface BookingContextType {
  bookings: Booking[];
}
