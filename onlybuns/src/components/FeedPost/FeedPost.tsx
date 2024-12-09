import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaEllipsisH, FaHeart, FaComment } from 'react-icons/fa';
import styles from './FeedPost.module.css';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

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
        likeCount: number;
    };
}

const FeedPost: React.FC<PostProps> = ({ post }) => {
    const authContext = useContext(AuthContext);
    const [comments, setComments] = useState<Comment[]>([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [liked, setLiked] = useState(false);
    const [showLikeAnimation, setShowLikeAnimation] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState(post.description);

    if (!authContext) throw new Error('AuthContext is undefined!');

    const { auth } = authContext;
    const userId = auth.user?.id;

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
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    const deletePost = async () => {
        try {
            await axios.delete(`/api/posts/id/${post.id}`);
            console.log('Post deleted successfully');
            // You may want to trigger a re-fetch or remove the post from the parent component
            navigate('/profile');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const editPost = async () => {
        if (!editedDescription.trim()) return;
        try {
            const updatedPost = { ...post, description: editedDescription };
            const response = await axios.put(`/api/posts/id/${post.id}`, updatedPost);

            post.description = editedDescription
            setIsEditing(false);
            console.log('Post updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating post:', error);
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
                                <li
                                    onClick={() => setIsEditing(true)}
                                    className={styles['post-menu-item']}
                                >
                                    Edit
                                </li>
                                <li
                                    onClick={deletePost}
                                    className={styles['post-menu-item']}
                                >
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

            {/* Post Description */}
            {isEditing ? (
                <div className={styles['post-edit-container']}>
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className={styles['post-edit-input']}
                    />
                    <button onClick={editPost} className={styles['post-save-button']}>
                        Save
                    </button>
                </div>
            ) : (
                <div className={styles['post-likes-description']}>
                    <p className={styles['post-post-description']}>
                        <span className={styles['post-author-name']}>{post.user.username}: </span>
                        {post.description}
                    </p>
                </div>
            )}

            {/* Like and Comment Icons */}
            <div className={styles['post-bottom-bar']}>
                <div className={styles['post-bottom-icons']}>
                    <FaHeart
                        className={`${styles['post-icon']} ${liked ? styles['liked'] : styles['unliked']}`}
                        onClick={toggleLike}
                    />
                    <span>{post.likeCount}</span> {/* Display like count */}
                    <FaComment className={styles['post-icon']} onClick={handleToggleComments} />
                </div>
            </div>

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
        </div>
    );
};

export default FeedPost;
