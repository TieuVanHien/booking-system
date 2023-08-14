import React from 'react';
import Link from 'next/link';

const Nav = () => {
  return (
    <div className="navbar flex items-center">
      <div className="links">
        <Link className="link mr-4" href="/">
          Gallery
        </Link>
        <Link className="link" href="/">
          Contact Us
        </Link>
      </div>
      <h3>JV Nail & Spa</h3>
      <div className="user-link ml-12">
        <Link className="link mr-4" href="/login">
          Login
        </Link>
        <Link className="link register-link" href="/register">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Nav;
