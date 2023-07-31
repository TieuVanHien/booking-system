import React, { useState, useEffect, useContext } from 'react';
import { UserProps } from '@/interfaces/interface';
import { Booking, Setting, BookingHistory, Sidebar } from '@/components/index';
import { AuthenticationContext } from '@/context/authentication';
import Image from 'next/image';

const User = () => {
  const [selectedLink, setSelectedLink] = useState('overview');
  const [user, setUserData] = useState<UserProps | null>(null);

  const { logout } = useContext(AuthenticationContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {});
        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async (e: any) => {
    e.preventDefault();
    await logout();
  };

  const renderContent = () => {
    switch (selectedLink) {
      case 'overview':
        return <Booking />;
      case 'bookinghistory':
        return <BookingHistory />;
      case 'setting':
        return <Setting />;
      default:
        return null;
    }
  };
  return (
    <section className="dashboard flex justify-center items-center">
      <div className="left flex flex-col justify-center items-center">
        <div className="top-sidebar">
          <Image src="" alt="test" />
          <h3>@{user?.username}</h3>
          {user && (
            <h4>
              {user.first_name} {user.last_name}
            </h4>
          )}
          <p>{user?.email}</p>
        </div>
        <div className="btm-sidebar">
          <Sidebar setSelectedLink={setSelectedLink} />
        </div>
        <a href="/home" onClick={handleLogout}>
          Sign Out
        </a>
      </div>
      <div className="right">
        <div>{renderContent()}</div>
      </div>
    </section>
  );
};

export default User;
