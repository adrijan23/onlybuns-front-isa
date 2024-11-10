import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {

  return (
    <div className={styles.navbar}>
      <nav >
        <Link to="/profile" className={styles.link}>Profile</Link>
        <Link to="/feed" className={styles.link}>Your Posts</Link>
        <Link to="/trends" className={styles.link}>Trends</Link>
        <Link to="/map" className={styles.link}>Posts near you</Link>
        <Link to="/chat" className={styles.link}>Chat</Link>
        <Link to="/post" className={styles.link}>Post</Link>
        <Link to="/createpost" className={styles.link}>Create Post</Link>
        <Link to="/login" className={styles.link}>Login</Link>
      </nav>
    </div>
  );
};

export default Navbar;
