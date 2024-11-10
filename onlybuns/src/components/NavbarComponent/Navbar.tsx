import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

const Navbar = () => {

  return (
    <nav className="navbar">
      <Link to="/profile" className="link">Profile</Link>
      <Link to="/feed" className="link">Your Posts</Link>
      <Link to="/trends" className="link">Trends</Link>
      <Link to="/map" className="link">Posts near you</Link>
      <Link to="/chat" className="link">Chat</Link>
    </nav>
  );
};

export default Navbar;
