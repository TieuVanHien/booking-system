import React, { useState, useEffect, useContext } from 'react';
import { AuthenticationContext } from '@/context/authentication';
import { UserProps } from '@/interfaces/interface';
import { Overview, Setting, Blocker, Sidebar } from '@/components/index';
import Image from 'next/image';

const User = () => {
  const [selectedLink, setSelectedLink] = useState('overview');
  const [user, setUserData] = useState<UserProps | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {});
        const data = await response.json();
        console.log(data);
        setUserData(data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

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
          <h3>@{user?.username}</h3>
          <p>{user?.email}</p>
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
