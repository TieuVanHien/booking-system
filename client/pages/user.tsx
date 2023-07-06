import React, { useState, useEffect, useContext } from 'react';
import { AuthenticationContext } from '@/context/authentication';
import axios from 'axios';
import { Overview, Setting, Blocker, Sidebar } from '@/components/index';
import Image from 'next/image';
import '@/styles/dashboard.scss';

interface User {
  username: string;
  email: string;
}

const User = () => {
  const [selectedLink, setSelectedLink] = useState('overview');
  const [userData, setUserData] = useState<User | null>(null);
  const authContext = useContext(AuthenticationContext);
  const { accessToken } = authContext;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        console.log(data);
        setUserData(data.user);
      } catch (error) {
        console.error(error);
      }
    };
    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken]);

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
          <h3>@{userData?.username}</h3>
          <p>{userData?.email}</p>
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
