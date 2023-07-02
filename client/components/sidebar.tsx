import React, { Dispatch, SetStateAction } from 'react';

interface SidebarProps {
  setSelectedLink: Dispatch<SetStateAction<string>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedLink }) => {
  const handleLinkClick = (link: string) => {
    setSelectedLink(link);
  };

  return (
    <aside>
      <p onClick={() => handleLinkClick('overview')}>Overview</p>
      <p onClick={() => handleLinkClick('urlblocker')}>Urlblocker</p>
      <p onClick={() => handleLinkClick('setting')}>Setting</p>
    </aside>
  );
};

export default Sidebar;
