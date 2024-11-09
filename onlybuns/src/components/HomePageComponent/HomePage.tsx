import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="container">
      <h2>Dobrodošli!</h2>
      <nav className="nav">
        <Link to="/feed" className="link">Lista objava korisnika</Link>
        <Link to="/trends" className="link">Trendovi na mreži</Link>
        <Link to="/map" className="link">Obližnje objave na mapi</Link>
        <Link to="/chat" className="link">Čet između korisnika</Link>
        <Link to="/profile" className="link">Profil korisnika</Link>
      </nav>
    </div>
  );
};

export default HomePage;
