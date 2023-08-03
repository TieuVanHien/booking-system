import React, { useState, useEffect, useContext } from 'react';
import { SidebarAdmin } from '@/components';
import { CalendarComponent, BookingHistory } from '@/components';
import { AuthenticationContext } from '@/context/authentication';

const Admin = () => {
  const [selectedLink, setSelectedLink] = useState('overview');
  const { logout } = useContext(AuthenticationContext);
  const renderContent = () => {
    switch (selectedLink) {
      case 'overview':
        return <CalendarComponent />;
      case 'bookinghistory':
        return <BookingHistory />;
      default:
        return null;
    }
  };
  const handleLogout = async (e: any) => {
    e.preventDefault();
    await logout();
  };
  return (
    <section className="dashboard flex justify-center items-center">
      <div className="left flex flex-col justify-between items-center">
        <h1>@Admin</h1>
        <div className="btm-sidebar">
          <SidebarAdmin setSelectedLink={setSelectedLink} />
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

export default Admin;
