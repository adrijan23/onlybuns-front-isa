import React, { useState, useEffect, useContext } from 'react';
import { FaEllipsisH, FaHeart, FaComment } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import styles from './Post.module.css';
import axios from '../../config/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

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

const Post = () => {
    const { id } = useParams<{ id: string }>();
    const [comments, setComments] = useState<Comment[]>([]);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [newComment, setNewComment] = useState<string>('');
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [post, setPost] = useState<Post | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedDescription, setEditedDescription] = useState<string>('');
    const [liked, setLiked] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("AuthContext is undefined!");
    const { auth } = authContext;
    const userId = auth.user?.id;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get<Post>(`/api/posts/id/${id}`);
                setPost(response.data);
            } catch (error) {
                setError('Error fetching post');
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [id]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get<Comment[]>(`/api/posts/${id}/comments`);
                setComments(response.data);

                const likesResponse = await axios.get<User[]>(`http://localhost:8082/api/posts/${id}/likes`,
                    {
                        params: { userId },
                    }
                );
                setLiked((likesResponse.data || []).some(like => like.id === userId));
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchDetails();
    }, [id]);

    const addComment = async () => {
        if (newComment.trim()) {
            try {
                const response = await axios.post(`/api/posts/${id}/comments`, {
                    content: newComment,
                    userId: userId,
                });
                setComments([...comments, response.data]);
                setNewComment('');
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    const likePost = async () => {
        try {
            await axios.post(`/api/posts/${id}/like`, null, {
                params: { userId }
            });
            setLiked(true);
        } catch (error) {
            console.error('Error liking post: ', error);
        }
    }

    const unlikePost = async () => {
        try {
            const userId = post?.user.id;
            await axios.delete(`/api/posts/${id}/like`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: { userId },
            });
            setLiked(false);
        } catch (error) {
            console.error('Error unliking post:', error);
        }
    };

    const toggleLike = () => {
        liked ? unlikePost() : likePost();
    }

    const editPost = async () => {
        if (!editedDescription.trim()) {
            return;
        }
        const updatedPost = { ...post, description: editedDescription };

        try {
            const response = await axios.put(`/api/posts/id/${post?.id}`, updatedPost, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setPost(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };

    const deletePost = async () => {
        try {
            await axios.delete(`/api/posts/id/${post?.id}`);

            console.log('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const getImageUrl = (imagePath: string) => {
        return `http://localhost:8082/${imagePath}`;
    };


    if (error) return <p>{error}</p>;
    if (!post) return <p>Loading post...</p>;

    return (
        <div className={styles['post-container']}>
            {/* Top Bar */}
            <div className={styles['post-top-bar']}>
                <div className={styles['post-author-info']}>
                    {/* <img src={post?.us} alt="author" className="post-profile-image" /> */}
                    <span className={styles['post-author-name']}>{post?.user.username}</span>
                </div>
                <div className={styles['post-menu']}>
                    <FaEllipsisH className={styles['post-menu-icon']} onClick={() => setShowMenu(!showMenu)} />
                    {showMenu && (
                        <div className={styles['post-menu-dropdown']}>
                            <button onClick={() => setIsEditing(true)} className={styles['post-menu-item']}>Edit</button>
                            <button onClick={deletePost} className={styles['post-menu-item']}>Delete</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Post Image */}
            {post?.imagePath && (
                <img
                    src={getImageUrl(post.imagePath)}
                    alt="post"
                    className={styles['post-image']}
                />
            )}

            {/* Post Description */}
            {isEditing ? (
                <div className={styles['post-edit-container']}>
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className={styles['post-edit-input']}
                    />
                    <button onClick={editPost} className={styles['post-save-button']}>Save</button>
                </div>
            ) : (
                <div className={styles['post-likes-description']}>
                    <p className={styles['post-description']}>
                        <span className={styles['post-author-name']}>{post?.user.username}: </span>
                        {post?.description}
                    </p>
                </div>
            )}

            {/* Bottom Bar */}
            <div className={styles['post-bottom-bar']}>
                <div className={styles['post-bottom-icons']}>
                            <FaHeart
                className={`${styles['post-icon']} ${liked ? styles['liked'] : styles['unliked']}`}
                onClick={toggleLike}
            />
                    <FaComment className={styles['post-icon']} onClick={() => setShowComments(!showComments)} />
                </div>
            </div>

            {/* Likes and Description */}
            {/* <div className={styles['post-likes-description']}>
                //<span className='post-likes-count'>{post?.likesCount} likes</span>
                <p className={styles['post-description']}>
                    <span className={styles['post-author-name']}>{post?.user.username}: </span>
                    {post?.description}
                </p>
            </div> */}

            {/* Comment Section */}
            {showComments && (
                <div className={styles['post-comment-section']}>
                    {comments && comments.length > 0 ? (
                        <ul className={styles['post-comment-list']}>
                            {comments.map((comment, index) => (
                                <li key={index} className={styles['post-comment-item']}>
                                    <span className={styles['post-comment-username']}>{comment.user.username}: </span>
                                    <span className={styles['post-comment-text']}>{comment.content}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No comments yet</p>
                    )}
                    <div className={styles['post-comment-input-container']}>
                        <input
                            type='text'
                            placeholder='Add a comment...'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className={styles['post-comment-input']}
                        />
                        <button onClick={addComment} className={styles['post-add-comment-button']}>
                            Add
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;
