import React, { useContext, useEffect, useState } from 'react';
import styles from './Profile.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../config/axiosConfig';

interface Comment {
  username: string;
  text: string;
}

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
  lastPasswordResetDate: number;
  roles: Role[];
}

interface Role {
  name: string;
}

interface Post {
  id: number;
  imagePath: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  user: User;
}

const Profile: React.FC = () => {

  const authContext = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  if (!authContext) throw new Error("AuthContext is undefined!");

  const { auth } = authContext;
  const username = auth.user?.username;
  const userId = auth.user?.id;
  const profileImage = 'https://via.placeholder.com/150';
  const image = 'https://via.placeholder.com/300';
  const postsCount = userPosts.length;
  const likes = 100;
  const comments = 20;
  const followersCount = 150;
  const followingCount = 180;

  // const userPosts = [
  //   { id: 1, imageUrl: 'https://via.placeholder.com/300', likes: 120, comments: 34 },
  //   { id: 2, imageUrl: 'https://via.placeholder.com/300', likes: 89, comments: 16 },
  //   { id: 3, imageUrl: 'https://via.placeholder.com/300', likes: 102, comments: 29 },
  //   { id: 4, imageUrl: 'https://via.placeholder.com/300', likes: 58, comments: 11 },
  //   { id: 5, imageUrl: 'https://via.placeholder.com/300', likes: 200, comments: 55 },
  //   { id: 6, imageUrl: 'https://via.placeholder.com/300', likes: 145, comments: 42 },
  // ];

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch posts for the user based on userId
    const fetchPosts = async () => {
      try {
        if (userId) {
          const response = await axios.get<Post[]>(`http://localhost:8082/api/posts/${userId}`);
          setUserPosts(response.data);
        }
      } catch (error) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
  }

  return (
    <div className={styles['profile-page-container']}>
      {/* Profile Section */}
      <div className={styles['profile-info']}>
        <div className={styles['profile-left']}>
          <img src={profileImage} alt='Profile' className={styles['profile-image']} />
          <span className={styles['profile-username']}>{username}</span>
        </div>
        <div className={styles['profile-right']}>
          <div className={styles['profile-stats']}>
            <div className={styles['profile-stat-item']}>
              <span className={styles['profile-stat-count']}>{postsCount}</span>
              <span className={styles['profile-stat-label']}>Posts</span>
            </div>
            <div className={styles['profile-stat-item']}>
              <span className={styles['profile-stat-count']}>{followersCount}</span>
              <span className={styles['profile-stat-label']}>Followers</span>
            </div>
            <div className='profile-stat-item'>
              <span className={styles['profile-stat-count']}>{followingCount}</span>
              <span className={styles['profile-stat-label']}>Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts Section */}
      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className={styles['profile-posts-grid']}>
          {userPosts.map((post) => (
            <div
              key={post.id}
              className={styles['profile-post-container']}
              onClick={() => handlePostClick(post.id)}
            >
              <img src={image} alt={`Post ${post.id}`} className={styles['profile-post-thumbnail']} />
              <div className={styles['profile-post-info']}>
                <span className={styles['profile-post-likes']}>{likes} Likes</span>
                <span className={styles['profile-post-comments']}>{comments} Comments</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
