import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePost from './components/CreatePostComponent/CreatePost';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ActivateAccount from './components/ActivateAccount';
import Layout from './components/LayoutComponent/Layout';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import UsersPage from './pages/UsersPage';
import TrendsPage from './pages/TrendsPage';
import AnalyticsPage from './pages/AnalyticsPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<HomePage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/activate" element={<ActivateAccount />} />

            <Route
              path="/createpost"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post/:id"
              element={
                <ProtectedRoute>
                  <PostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trends"
              element={
                <ProtectedRoute>
                  <TrendsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
