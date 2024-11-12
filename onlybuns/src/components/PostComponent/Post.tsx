import React, { useState, useEffect } from 'react';
import { FaEllipsisH, FaHeart, FaComment } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import styles from './Post.module.css';
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

const Post = () => {
    const { id } = useParams<{ id: string }>();
    const [comments, setComments] = useState<Comment[]>([
        { username: 'Alice', text: 'Great post!' },
        { username: 'Bob', text: 'Amazing content! This is a longer comment to test line wrapping.' }]);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [newComment, setNewComment] = useState<string>('');
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [post, setPost] = useState<Post | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedDescription, setEditedDescription] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

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

    const addComment = () => {
        if (newComment.trim()) {
            setComments([...comments, { username: 'me', text: newComment }]);
            setNewComment('');
        }
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
            await axios.delete(`/api/posts/id/1`);

            console.log('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const getImageUrl = (imagePath: string) => {
        console.log(post?.imagePath);
        return `http://localhost:8082/${imagePath}`; // Adjust base URL if needed
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
                    <FaHeart className={styles['post-icon']} />
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
                    <ul className={styles['post-comment-list']}>
                        {comments.map((comment, index) => (
                            <li key={index} className={styles['post-comment-item']}>
                                <span className={styles['post-comment-username']}>{comment.username}: </span>
                                <span className={styles['post-comment-text']}>{comment.text}</span>
                            </li>
                        ))}
                    </ul>
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
