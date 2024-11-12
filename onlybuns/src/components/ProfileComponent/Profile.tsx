import React, { useContext, useEffect, useState } from 'react';
import styles from './Profile.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../config/axiosConfig';

interface User {
  id: number;
  username: string;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: User;
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

interface PostDetails {
  likes: number;
  comments: number;
}

const Profile: React.FC = () => {

  const authContext = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postDetails, setPostDetails] = useState<{ [key: number]: PostDetails }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);

  if (!authContext) throw new Error("AuthContext is undefined!");

  const { auth } = authContext;
  const username = auth.user?.username;
  const userId = auth.user?.id;
  const profileImage = 'https://via.placeholder.com/150';
  const image = 'https://via.placeholder.com/300';
  const postsCount = userPosts.length;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await axios.get<Post[]>(`http://localhost:8082/api/posts/${userId}`);
          setUserPosts(response.data);

          // const followersResponse = await axios.get<User[]>(`http://localhost:8082/api/user/${userId}/followers`);
          // setFollowersCount(followersResponse.data.length);

          // const followingResponse = await axios.get<User[]>(`http://localhost:8082/api/user/${userId}/following`);
          // setFollowingCount(followingResponse.data.length);
        }
      } catch (error) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const fetchPostDetails = async (postId: number) => {
    try {
      const [likesResponse, commentsResponse] = await Promise.all([
        axios.get<User[]>(`http://localhost:8082/api/posts/${postId}/likes`,
          {
            params: { userId },
          }
        ),
        axios.get<Comment[]>(`http://localhost:8082/api/posts/${postId}/comments`),
      ]);

      setPostDetails(previous => ({
        ...previous,
        [postId]: {
          likes: likesResponse.data.length,
          comments: commentsResponse.data.length,
        }
      }));
    } catch (error) {
      setError(`Failed to load details for post ${postId}`);
    }
  }

  useEffect(() => {
    if (userPosts.length > 0) {
      userPosts.forEach(post => fetchPostDetails(post.id));
    }
  }, [userPosts]);

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
            {/* <div className={styles['profile-stat-item']}>
              <span className={styles['profile-stat-count']}>{followersCount}</span>
              <span className={styles['profile-stat-label']}>Followers</span>
            </div>
            <div className='profile-stat-item'>
              <span className={styles['profile-stat-count']}>{followingCount}</span>
              <span className={styles['profile-stat-label']}>Following</span>
            </div> */}
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
                <span className={styles['profile-post-likes']}>{postDetails[post.id]?.likes ?? 0} Likes</span>
                <span className={styles['profile-post-comments']}>{postDetails[post.id]?.comments ?? 0} Comments</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
