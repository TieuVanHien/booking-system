import React from 'react';
import { SidebarProps } from '@/interfaces/interface';

const Sidebar: React.FC<SidebarProps> = ({ setSelectedLink }) => {
  const handleLinkClick = (link: string) => {
    setSelectedLink(link);
  };
  return (
    <div className="sidebar flex flex-col justify-center items-start">
      <h4 className="mt-2" onClick={() => handleLinkClick('overview')}>
        Booking
      </h4>
      <h4 className="mt-2" onClick={() => handleLinkClick('bookinghistory')}>
        History
      </h4>
      <h4 className="mt-2" onClick={() => handleLinkClick('setting')}>
        Setting
      </h4>
    </div>
  );
};

export default Sidebar;
