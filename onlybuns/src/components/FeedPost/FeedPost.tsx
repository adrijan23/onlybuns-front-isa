import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import { FaEllipsisH, FaHeart, FaComment, FaTimes } from 'react-icons/fa';
import styles from './FeedPost.module.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

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

interface PostProps {
    post: {
        id: number;
        description: string;
        imagePath: string;
        user: User;
        address?: string;
        latitude?: number;
        longitude?: number;
    };
    onPostUpdated?: (updatedPost: any) => void;
}

const FeedPost: React.FC<PostProps> = ({ post, onPostUpdated }) => {
    const authContext = useContext(AuthContext);
    const [comments, setComments] = useState<Comment[]>([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [liked, setLiked] = useState(false);
    const [showLikeAnimation, setShowLikeAnimation] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const [editForm, setEditForm] = useState({
        description: post.description,
        address: post.address || '',
        latitude: post.latitude || null,
        longitude: post.longitude || null,
        image: null as File | null,
        imagePreview: null as string | null,
    });

    const [editCoordinates, setEditCoordinates] = useState<{ lat: number; lng: number } | null>(
        post.latitude && post.longitude ? { lat: post.latitude, lng: post.longitude } : null
    );

    if (!authContext) throw new Error('AuthContext is undefined!');

    const { auth } = authContext;
    const userId = auth.user?.id;
    const isAdmin = auth.user?.roles?.some(role => role.name === "ROLE_ADMIN");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/posts/${post.id}/comments`);
                setComments(response.data || []);
            } catch (error) {
                console.error('Error fetching comments:', error);
                setComments([]);
            }
        };
        fetchLikeCount();
        checkLike();
        fetchComments();
    }, [post.id]);

    const handleToggleComments = () => {
        setShowComments(!showComments);
    };

    const likePost = async () => {
        if (!auth || !userId) {
            navigate('/login');
            return;
        }

        try {
            await axios.post(`/api/posts/${post.id}/like`, null);
            setLiked(true);
            triggerLikeAnimation(); // Show the heart animation
            setLikeCount(likeCount + 1);
        } catch (error) {
            console.error('Error liking post: ', error);
        }
    };

    const unlikePost = async () => {
        if (!auth || !userId) {
            navigate('/login');
            return;
        }

        try {
            await axios.delete(`/api/posts/${post.id}/like`);
            setLiked(false);
            setLikeCount(likeCount - 1);
        } catch (error) {
            console.error('Error unliking post:', error);
        }
    };

    const fetchLikeCount = async () => {
        try {
            const response = await axios.get<number>(`http://localhost:8082/api/posts/${post.id}/like_count`);
            setLikeCount(response.data);
        } catch (error) {
            console.error('Error unliking post:', error);
        }
    };

    const checkLike = async () => {
        try {
            const response = await axios.get(`/api/posts/${post.id}/has_liked`);
            setLiked(response.data);
        } catch (error) {
            console.error('Error unliking post:', error);
        }
    };

    const toggleLike = () => {
        liked ? unlikePost() : likePost();
    };

    const triggerLikeAnimation = () => {
        setShowLikeAnimation(true);
        setTimeout(() => setShowLikeAnimation(false), 1000); // Remove animation after 1 second
    };

    const addComment = async () => {
        if (!auth || !userId) {
            navigate('/login');
            return;
        }

        if (newComment.trim()) {

            try {
                const response = await axios.post(`/api/posts/${post.id}/comments`, {
                    content: newComment,
                    userId,
                });
                setComments([...comments, response.data]);
                setNewComment('');

            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 429 || error.response?.status === 403) {
                        const errorMessage = error.response?.data
                        alert(errorMessage);
                    }
                } else {
                    console.error('Unexpected error:', error);
                    alert('An unexpected error occurred. Please try again.');
                }
            }
        }
    };

    const deletePost = async () => {
        try {
            await axios.delete(`/api/posts/id/${post.id}`);
            console.log('Post deleted successfully');
            // You may want to trigger a re-fetch or remove the post from the parent component
            navigate(`/profile/${auth.user?.id}`);
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const getAddressFromCoordinates = async (lat: number, lng: number) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            setEditForm(prev => ({ ...prev, address: response.data.display_name }));
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    const LocationMarker = () => {
        useMapEvents({
            click(e: LeafletMouseEvent) {
                setEditCoordinates(e.latlng);
                setEditForm(prev => ({
                    ...prev,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng
                }));
                getAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
            },
        });
        return editCoordinates ? <Marker position={[editCoordinates.lat, editCoordinates.lng]} /> : null;
    }

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setEditForm(prev => ({ ...prev, image: file }));

        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setEditForm(prev => ({ ...prev, imagePreview: previewUrl }));
        } else {
            setEditForm(prev => ({ ...prev, imagePreview: null }));
        }
    };

    const handleEditSubmit = async () => {
        if (!editForm.description.trim()) {
            alert('Description is required');
            return;
        }
        const postRequest = {
            description: editForm.description,
            address: editForm.address,
            latitude: editForm.latitude,
            longitude: editForm.longitude,
        };

        try {
            // Create FormData for the request
            const formData = new FormData();
            const jsonBlob = new Blob([JSON.stringify(postRequest)], { type: 'application/json' });
            formData.append('postRequest', jsonBlob);

            // Only append image if a new one was selected
            if (editForm.image) {
                formData.append('image', editForm.image);
            }

            const response = await axios.put(`/api/posts/id/${post.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update the post data
            const updatedPost = { ...post, ...response.data };
            if (onPostUpdated) {
                onPostUpdated(updatedPost);
            }

            setShowEditModal(false);
            setShowMenu(false);
            console.log('Post updated successfully:', response.data);
            navigate(`/profile/${auth.user?.id}`);
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Error updating post. Please try again.');
        }
    }

    const openEditModal = () => {
        setEditForm({
            description: post.description,
            address: post.address || '',
            latitude: post.latitude || null,
            longitude: post.longitude || null,
            image: null,
            imagePreview: null,
        });
        setEditCoordinates(
            post.latitude && post.longitude ? { lat: post.latitude, lng: post.longitude } : null
        );
        setShowEditModal(true);
        setShowMenu(false);
    };

    const markPostForAds = async () => {
        try {
            await axios.put(`/api/posts/${post.id}/mark-for-ads`);
            alert('Post successfully marked for ads!');
        } catch (error) {
            console.error('Error marking post for ads:', error);
            alert('Failed to mark post for ads.');
        }
    };

    return (
        <div className={styles['post-container']}>
            {/* Top Bar */}
            <div className={styles['post-top-bar']}>
                <div className={styles['post-author-info']}>
                    <span className={styles['post-author-name']}>
                        <Link to={`/profile/${post.user.id}`} className={styles['profile-link']}>
                            {post.user.username}
                        </Link>
                    </span>
                </div>
                {post.user.id === userId && (
                    <div className={styles['post-menu-container']}>
                        <FaEllipsisH
                            className={styles['post-menu-icon']}
                            onClick={() => setShowMenu(!showMenu)}
                        />
                        {showMenu && (
                            <ul className={styles['post-menu-dropdown']}>
                                <li onClick={openEditModal} className={styles['post-menu-item']}>
                                    Edit
                                </li>
                                <li onClick={deletePost} className={styles['post-menu-item']}>
                                    Delete
                                </li>
                            </ul>
                        )}
                    </div>
                )}
            
            </div>

            {/* Post Image with Like Animation */}
            <div className={styles['post-image-container']}>
                {showLikeAnimation && (
                    <div className={styles['like-animation']}>
                        <FaHeart className={styles['like-animation-heart']} />
                    </div>
                )}
                <img
                    src={`http://localhost:8082/${post.imagePath}`}
                    alt="Post"
                    className={styles['post-image']}
                />
            </div>

            <div className='like-count'>
                <span>{likeCount} likes</span>
            </div>

            {/* Post Description */}


            {/* Post Description and Location */}
            <div className={styles['post-likes-description']}>
                <p className={styles['post-post-description']}>
                    <span className={styles['post-author-name']}>{post.user.username}: </span>
                    {post.description}
                </p>
                {post.address && (
                    <p className={styles['post-location']}>
                        📍 {post.address}
                    </p>
                )}
            </div>

            {/* Like and Comment Icons */}
            <div className={styles['post-bottom-bar']}>
                <div className={styles['post-bottom-icons']}>
                    <FaHeart
                        className={`${styles['post-icon']} ${liked ? styles['liked'] : styles['unliked']}`}
                        onClick={toggleLike}
                    />
                    <FaComment className={styles['post-icon']} onClick={handleToggleComments} />
                </div>
            </div>

            {/* Admin Mark for Ads Button */}
            {isAdmin && (
                <div className={styles['admin-actions']}>
                    <button 
                        onClick={markPostForAds}
                        className={styles['mark-for-ads-button']}
                    >
                        Mark for Ads
                    </button>
                </div>
            )}

            {/* Comment Section */}
            {showComments && (
                <div className={styles['post-comment-section']}>
                    {comments.length > 0 ? (
                        <ul className={styles['post-comment-list']}>
                            {comments.map((comment) => (
                                <li key={comment.id} className={styles['post-comment-item']}>
                                    <span className={styles['post-comment-username']}>
                                        {comment.user.username}:
                                    </span>{' '}
                                    {comment.content}
                                    <br />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles['no-comments-message']}>
                            No comments yet. Be the first to comment!
                        </p>
                    )}

                    <div className={styles['post-comment-input-container']}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className={styles['post-comment-input']}
                        />
                        <button onClick={addComment} className={styles['post-add-comment-button']}>
                            Comment
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className={styles['edit-modal-overlay']}>
                    <div className={styles['edit-modal']}>
                        <div className={styles['edit-modal-header']}>
                            <h3>Edit Post</h3>
                            <FaTimes
                                className={styles['edit-modal-close']}
                                onClick={() => setShowEditModal(false)}
                            />
                        </div>

                        <div className={styles['edit-modal-content']}>
                            <div className={styles['edit-form-group']}>
                                <label>Description:</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter post description"
                                    className={styles['edit-textarea']}
                                />
                            </div>

                            <div className={styles['edit-form-group']}>
                                <label>Update Image:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                    className={styles['edit-file-input']}
                                />
                                {editForm.imagePreview && (
                                    <div className={styles['edit-image-preview']}>
                                        <img
                                            src={editForm.imagePreview}
                                            alt="New Preview"
                                            className={styles['edit-preview-image']}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className={styles['edit-form-group']}>
                                <label>Location:</label>
                                <input
                                    type="text"
                                    value={editForm.address}
                                    placeholder="Click on map to select location"
                                    readOnly
                                    className={styles['edit-address-input']}
                                />
                            </div>

                            <div className={styles['edit-form-group']}>
                                <label>Select Location on Map:</label>
                                <div className={styles['edit-map-container']}>
                                    <MapContainer
                                        center={editCoordinates || [51.505, -0.09]}
                                        zoom={13}
                                        style={{ height: '200px', width: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <LocationMarker />
                                    </MapContainer>
                                </div>
                            </div>
                        </div>

                        <div className={styles['edit-modal-footer']}>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className={styles['edit-cancel-button']}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                className={styles['edit-save-button']}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedPost;