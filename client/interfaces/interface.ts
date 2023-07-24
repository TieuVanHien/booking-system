import { Dispatch, SetStateAction, ReactNode } from 'react';

export interface SidebarProps {
  setSelectedLink: Dispatch<SetStateAction<string>>;
}
export interface UserProps {
  username: string;
  email: string;
  id: number;
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
  register: (username: string, email: string, password: string) => void;
  checkUserLogin: () => void;
  logout: () => void;
  addBooking: (newBooking: NewEvent, user_id: number) => Promise<void>;
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
  id: string | null;
  title: string;
  service: string | null;
  duration: number;
  start: Date | null;
  end: Date | null;
}

export interface Booking {
  id: number;
  title: string;
  service: string | null;
  duration: number;
  start: Date | null;
  end: Date | null;
}

export interface BookingContextType {
  bookings: Booking[];
}
