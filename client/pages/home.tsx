'use client';
import React from 'react';
import { Nav } from '@/components';
import Image from 'next/image';
import { home1 } from '@/public/images';

const HomePage = () => {
  return (
    <div className="home flex flex-col justify-center items-center">
      <Nav />
      <div className="main flex justify-center">
        <div className="left flex flex-col justify-center items-start">
          <h1>JV Nail & Spa</h1>
          <p>
            There’s nothing a good manicure can’t fix, don’t you think ? At
            Nailed It Salon we are fighting to raise the standards of clean,
            ethical beauty.
          </p>
        </div>
        <div className="right">
          <Image
            height={600}
            width={500}
            src={home1}
            alt="gel image on home section"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
