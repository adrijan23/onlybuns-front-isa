import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.container}>
      <h2>Dobrodošli!</h2>
      <nav className={styles.nav}>
        <Link to="/feed" className={styles.link}>Lista objava korisnika</Link>
        <Link to="/trends" className={styles.link}>Trendovi na mreži</Link>
        <Link to="/map" className={styles.link}>Obližnje objave na mapi</Link>
        <Link to="/chat" className={styles.link}>Čet između korisnika</Link>
        <Link to="/profile" className={styles.link}>Profil korisnika</Link>
        <Link to="/login" className={styles.link}>Login</Link>
        <Link to="/post" className={styles.link}>Post korisnika</Link>
      </nav>
    </div>
  );
};

export default HomePage;
