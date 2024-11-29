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
                    <Route path="/admin/users" element={<UsersPage />} />

                    <Route
                        path="/createpost"
                        element={
                            <ProtectedRoute>
                                <CreatePost/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
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
                </Route>
            </Routes>
        </Router>
    </AuthProvider>
  );
};

export default App;
