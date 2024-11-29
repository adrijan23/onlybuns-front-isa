import React, { useContext, useEffect, useState } from 'react';
import styles from './Profile.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../config/axiosConfig';
import FollowerList from '../FollowerList/FollowerList';

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
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
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isFollowersPopupVisible, setFollowersPopupVisible] = useState(false);
  const [isFollowingPopupVisible, setFollowingPopupVisible] = useState(false);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<User>();

  if (!authContext) throw new Error('AuthContext is undefined!');

  const { auth } = authContext;
  const username = auth.user?.username;
  const userId = auth.user?.id;
  const params = useParams();
  const profileId = Number(params.id); // Profile being viewed
  const profileImage = 'https://via.placeholder.com/150';
  const postsCount = userPosts.length;

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
    fetchPosts();
    fetchFollowers();
    fetchFollowing();

    closePopup();
  }, [profileId]);

  useEffect(() => {
    checkIfFollowed(); // Trigger when followers list changes
  }, [followers]);

  const fetchUserDetails = async () => {
    try {
      if (profileId) {
        const response = await axios.get<User>(`http://localhost:8082/api/user/${profileId}`);
        setUserDetails(response.data);
      }
    } catch (error) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      if (profileId) {
        const response = await axios.get<Post[]>(`http://localhost:8082/api/posts/${profileId}`);
        setUserPosts(response.data);
      }
    } catch (error) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowers = async () => {
    try {
      if (profileId) {
        const response = await axios.get<User[]>(`http://localhost:8082/api/${profileId}/followers`);
        setFollowers(response.data);
      }
    } catch (error) {
      setError('Failed to load followers');
    }
  };

  const fetchFollowing = async () => {
    try {
      if (profileId) {
        const response = await axios.get<User[]>(`http://localhost:8082/api/${profileId}/following`);
        setFollowing(response.data);
      }
    } catch (error) {
      setError('Failed to load following');
    }
  };

  const checkIfFollowed = () => {
    if (followers.some((follower) => follower.id === userId)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
  };

  const handleFollow = async () => {
    try {
      await axios.post(`http://localhost:8082/api/follow/${profileId}`);
      setIsFollowed(true);
      fetchFollowers(); // Refresh followers list
    } catch (error) {
      setError('Failed to follow user');
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post(`http://localhost:8082/api/unfollow/${profileId}`);
      setIsFollowed(false);
      fetchFollowers(); // Refresh followers list
    } catch (error) {
      setError('Failed to unfollow user');
    }
  };

  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  const handleFollowersClick = () => {
    setFollowersPopupVisible(true);
  };

  const handleFollowingClick = () => {
    setFollowingPopupVisible(true);
  };

  const closePopup = () => {
    setFollowersPopupVisible(false);
    setFollowingPopupVisible(false);
  };

  return (
    <div className={styles['profile-page-container']}>
      {/* Profile Section */}
      <div className={styles['profile-info']}>
        <div className={styles['profile-left']}>
          <img src={profileImage} alt="Profile" className={styles['profile-image']} />
          <span className={styles['profile-username']}>{userDetails?.username}</span>
          <span className={styles['profile-name']}>{`${userDetails?.firstName || ''} ${userDetails?.lastName || ''}`}</span>
        </div>
        <div className={styles['profile-right']}>
          <div className={styles['profile-stats']}>
            <div className={styles['profile-stat-item']}>
              <span className={styles['profile-stat-count']}>{postsCount}</span>
              <span className={styles['profile-stat-label']}>Posts</span>
            </div>
            <div className={styles['profile-stat-item']} onClick={handleFollowersClick}>
              <span className={styles['profile-stat-count']}>{followers.length}</span>
              <span className={styles['profile-stat-label']}>Followers</span>
            </div>
            <div className={styles['profile-stat-item']} onClick={handleFollowingClick}>
              <span className={styles['profile-stat-count']}>{following.length}</span>
              <span className={styles['profile-stat-label']}>Following</span>
            </div>
          </div>
          <div>
            {/* Follow/Unfollow Button */}
            {profileId !== userId && (
              <button
                className={isFollowed ? styles['unfollow-button'] : styles['follow-button']}
                onClick={isFollowed ? handleUnfollow : handleFollow}
              >
                {isFollowed ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Popup for Followers */}
      {isFollowersPopupVisible && (
        <div className={styles['popup-overlay']}>
          <div className={styles['popup-container']}>
            <button className={styles['close-button']} onClick={closePopup}>
              &times;
            </button>
            <h2>Followers</h2>
            <FollowerList users={followers} />
          </div>
        </div>
      )}

      {/* Popup for Following */}
      {isFollowingPopupVisible && (
        <div className={styles['popup-overlay']}>
          <div className={styles['popup-container']}>
            <button className={styles['close-button']} onClick={closePopup}>
              &times;
            </button>
            <h2>Following</h2>
            <FollowerList users={following} />
          </div>
        </div>
      )}

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
              <img
                src={`http://localhost:8082/${post.imagePath}`}
                alt="Post"
                className={styles['profile-post-thumbnail']}
              />
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

