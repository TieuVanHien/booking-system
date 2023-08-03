import React from 'react';
import { SidebarProps } from '@/interfaces/interface';

const SidebarAdmin: React.FC<SidebarProps> = ({ setSelectedLink }) => {
  const handleLinkClick = (link: string) => {
    setSelectedLink(link);
  };
  return (
    <div className="sidebar flex flex-col justify-center items-start">
      <h4 className="mt-2" onClick={() => handleLinkClick('overview')}>
        Overview
      </h4>
      <h4 className="mt-2" onClick={() => handleLinkClick('history')}>
        History
      </h4>
    </div>
  );
};

export default SidebarAdmin;
