import React, { useState } from 'react';
import { Overview, Setting, Blocker, Sidebar } from '@/components/index';

const User: React.FC = () => {
  const [selectedLink, setSelectedLink] = useState('');

  const renderContent = () => {
    switch (selectedLink) {
      case 'overview':
        return <Overview />;
      case 'urlblocker':
        return <Blocker />;
      case 'setting':
        return <Setting />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Sidebar setSelectedLink={setSelectedLink} />
      <main>
        <h1>Home Page</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default User;
