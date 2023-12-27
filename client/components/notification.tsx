import React, { createContext, useContext, ReactNode } from 'react';
import { toast, ToastContainer, ToastContainerProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NotificationContextProps {
  children: ReactNode;
}

interface NotificationContextValue {
  notify: (message: string, options?: ToastContainerProps) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export const NotificationProvider: React.FC<NotificationContextProps> = ({
  children
}) => {
  const notify = (message: string, options?: ToastContainerProps) => {
    toast(message, options);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
