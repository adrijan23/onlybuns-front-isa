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
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/feed"
                    element={
                        <ProtectedRoute>
                            <Feed />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/trends"
                    element={
                        <ProtectedRoute>
                            <Trends/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/map"
                    element={
                        <ProtectedRoute>
                            <MapView />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Chat/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/blogpost"
                    element={
                        <ProtectedRoute>
                            <BlogPost/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
              <Route path="/post" element={<Post authorName="John Doe"
                authorProfileImage="https://via.placeholder.com/40"
                postImage="https://via.placeholder.com/600"
                description="The description of the post. Aaaaaaaaaaaaaaaaaaaaaaaaaa fenjafn jaefjaef eajkf ae jkf af."
                likesCount={0} />} />
            </Routes>
        </Router>
    </AuthProvider>
);
};

export default App;
