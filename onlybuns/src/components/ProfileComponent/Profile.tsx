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
  profileImage?: string;
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
  const [isImagePopupVisible, setImagePopupVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!authContext) throw new Error('AuthContext is undefined!');

  const { auth } = authContext;
  const username = auth.user?.username;
  const userId = auth.user?.id;
  const params = useParams();
  const profileId = Number(params.id); // Profile being viewed
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
        const posts = response.data;
        setUserPosts(posts);
  
        // Fetch like counts for each post
        const details: { [key: number]: PostDetails } = {};
        for (const post of posts) {
          const likeCountResponse = await axios.get<number>(`http://localhost:8082/api/posts/${post.id}/like_count`);
          details[post.id] = {
            likes: likeCountResponse.data,
            comments: 0, // Assuming comments will be fetched later
          };
        }
        setPostDetails(details);
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

  const handleSaveImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post(`/api/user/${profileId}/profile-image`, formData);
      console.log('Profile image updated:', response.data);
      setImagePopupVisible(false);
      fetchUserDetails(); // Refresh profile image
    } catch (error) {
      console.error('Failed to update profile image:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = async () => {
    try {
      await axios.post(`/api/user/${profileId}/remove-profile-image`); // Sending null to the server
      console.log('Profile image removed');
      setImagePopupVisible(false);
      fetchUserDetails(); // Refresh user details to reflect the removed image
    } catch (error) {
      console.error('Failed to remove profile image:', error);
    }
  };
  

  return (
    <div className={styles['profile-page-container']}>
      {/* Profile Section */}
      <div className={styles['profile-info']}>
        <div className={styles['profile-left']}>
          <img src={userDetails?.profileImage ? `http://localhost:8082/${userDetails?.profileImage}` : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="Profile" className={styles['profile-image']} onClick={() => profileId === userId && setImagePopupVisible(true)}/>
          <span className={styles['profile-username']}>{userDetails?.username}</span>
          <span className={styles['profile-name']}>{`${userDetails?.firstName || ''} ${userDetails?.lastName || ''}`}</span>
        </div>
        {/* Popup for Editing Profile Image */}
      {isImagePopupVisible && (
        <div className={styles['popup-overlay']}>
          <div className={styles['popup-container']}>
            <button className={styles['close-button']} onClick={() => setImagePopupVisible(false)}>
              &times;
            </button>
            <h2>Update Profile Image</h2>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" className={styles['image-preview']} />}
            <button className={styles['save-button']} onClick={handleSaveImage}>
              Save
            </button>
            <button className={styles['remove-button']} onClick={handleRemoveImage}>
              Remove Image
            </button>
          </div>
        </div>
      )}
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

