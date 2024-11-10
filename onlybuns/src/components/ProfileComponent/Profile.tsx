import React, { useContext } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Profile: React.FC = () => {

  const authContext = useContext(AuthContext);

  if (!authContext) throw new Error("AuthContext is undefined!");

  const { auth } = authContext;

  const username = auth.user?.username;
  const profileImage = 'https://via.placeholder.com/150';
  const postsCount = 34;
  const followersCount = 150;
  const followingCount = 180;

  const userPosts = [
    { id: 1, imageUrl: 'https://via.placeholder.com/300', likes: 120, comments: 34 },
    { id: 2, imageUrl: 'https://via.placeholder.com/300', likes: 89, comments: 16 },
    { id: 3, imageUrl: 'https://via.placeholder.com/300', likes: 102, comments: 29 },
    { id: 4, imageUrl: 'https://via.placeholder.com/300', likes: 58, comments: 11 },
    { id: 5, imageUrl: 'https://via.placeholder.com/300', likes: 200, comments: 55 },
    { id: 6, imageUrl: 'https://via.placeholder.com/300', likes: 145, comments: 42 },
  ];

  const navigate = useNavigate();

  const handlePostClick = (postId: number) => {
    navigate(`/post`);
  }

  return (
    <div className="profile-page-container">
      {/* Profile Section */}
      <div className="profile-info">
        <div className="profile-left">
          <img src={profileImage} alt='Profile' className='profile-image' />
          <span className='profile-username'>{username}</span>
        </div>
        <div className='profile-right'>
          <div className='profile-stats'>
            <div className='profile-stat-item'>
              <span className='profile-stat-count'>{postsCount}</span>
              <span className='profile-stat-label'>Posts</span>
            </div>
            <div className='profile-stat-item'>
              <span className='profile-stat-count'>{followersCount}</span>
              <span className='profile-stat-label'>Followers</span>
            </div>
            <div className='profile-stat-item'>
              <span className='profile-stat-count'>{followingCount}</span>
              <span className='profile-stat-label'>Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts Section */}
      <div className="profile-posts-grid">
        {userPosts.map((post) => (
          <div
            key={post.id}
            className="profile-post-container"
            onClick={() => handlePostClick(post.id)}
          >
            <img src={post.imageUrl} alt={`Post ${post.id}`} className="profile-post-thumbnail" />
            <div className="profile-post-info">
              <span className="profile-post-likes">{post.likes} Likes</span>
              <span className="profile-post-comments">{post.comments} Comments</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
