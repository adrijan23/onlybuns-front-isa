import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePageComponent/HomePage';
import Feed from './components/FeedComponent/Feed';
import Trends from './components/TrendsComponent/Trends';
import MapView from './components/MapComponent/MapView';
import Chat from './components/ChatComponent/Chat';
import Profile from './components/ProfileComponent/Profile';
import BlogPost from './components/BlogPostComponent/BlogPost';
import Login from './components/AuthComponents/Login';
import Signup from './components/AuthComponents/Signup';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/blogpost" element={<BlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
