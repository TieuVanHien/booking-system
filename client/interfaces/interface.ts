import { Dispatch, SetStateAction } from 'react';

export interface SidebarProps {
  setSelectedLink: Dispatch<SetStateAction<string>>;
}

export interface User {
  username: string;
  email: string;
  // Add other user properties as needed
}
