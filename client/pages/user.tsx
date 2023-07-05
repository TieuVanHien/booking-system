import React, { useState, useEffect, useContext } from 'react';
import { AuthenticationContext } from '@/context/authentication';
import { Overview, Setting, Blocker, Sidebar } from '@/components/index';
import Image from 'next/image';
import '@/styles/dashboard.scss';

interface User {
  username: string;
}

const User = () => {
  const [selectedLink, setSelectedLink] = useState('');
  const { user } = useContext(AuthenticationContext);

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
    <section className="dashboard flex justify-center items-center">
      <div className="left flex flex-col justify-center items-center">
        <div className="top-sidebar">
          <Image src="" alt="test" />
          <h3>username</h3>
          <p>Email</p>
        </div>
        <div className="btm-sidebar">
          <Sidebar setSelectedLink={setSelectedLink} />
        </div>
        <a href="/">Sign Out</a>
      </div>
      <div className="right">
        <div>{renderContent()}</div>
      </div>
    </section>
  );
};

export default User;
