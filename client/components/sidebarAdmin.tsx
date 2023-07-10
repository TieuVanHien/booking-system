import React from 'react';
import { SidebarProps } from '@/interfaces/interface';

const SidebarAdmin: React.FC<SidebarProps> = ({ setSelectedLink }) => {
  const handleLinkClick = (link: string) => {
    setSelectedLink(link);
  };
  return (
    <div className="sidebar">
      <h4 onClick={() => handleLinkClick('overview')}>Overview</h4>
      <h4 onClick={() => handleLinkClick('urlblocker')}>Urlblocker</h4>
      <h4 onClick={() => handleLinkClick('setting')}>Setting</h4>
    </div>
  );
};

export default SidebarAdmin;
