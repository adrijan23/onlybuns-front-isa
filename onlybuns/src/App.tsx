import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePageComponent/HomePage';
import Feed from './components/FeedComponent/Feed';
import Trends from './components/TrendsComponent/Trends';
import MapView from './components/MapComponent/MapView';
import Chat from './components/ChatComponent/Chat';
import Profile from './components/ProfileComponent/Profile';
import BlogPost from './components/BlogPostComponent/BlogPost';
import Post from './components/PostComponent/Post';

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
        <Route path="/post" element={<Post authorName="John Doe"
          authorProfileImage="https://via.placeholder.com/40"
          postImage="https://via.placeholder.com/600"
          description="The description of the post. Aaaaaaaaaaaaaaaaaaaaaaaaaa fenjafn jaefjaef eajkf ae jkf af."
          likesCount={0} />} />
      </Routes>
    </Router>
  );
};

export default App;
