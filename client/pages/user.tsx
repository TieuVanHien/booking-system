import React, { useState, useEffect } from 'react';
import { Overview, Setting, Blocker, Sidebar } from '@/components/index';
import Image from 'next/image';
import '@/styles/dashboard.scss';

interface User {
  username: string;
}

const User = () => {
  const [selectedLink, setSelectedLink] = useState('');
  const [user, setUser] = useState<User | null>(null);

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
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

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
      </div>
      <div className="right">
        <div>{renderContent()}</div>
      </div>
    </section>
  );
};

export default User;
