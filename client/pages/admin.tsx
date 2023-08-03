import React, { useState, useEffect } from 'react';
import { SidebarAdmin } from '@/components';
import { CalendarComponent, BookingHistory } from '@/components';

const Admin = () => {
  const [selectedLink, setSelectedLink] = useState('overview');
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
  return (
    <div>
      <h1>Hello Admin</h1>
      <SidebarAdmin setSelectedLink={setSelectedLink} />
      <div className="right">
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default Admin;
