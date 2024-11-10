import React, { useState, useEffect } from 'react';
import { FaEllipsisH, FaHeart, FaComment } from 'react-icons/fa';
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
    imagePath: string; // Corresponds to the "imagePath" in the JSON
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    user: User; // To link the user object as per the JSON
}

const Post = () => {
    const [comments, setComments] = useState<Comment[]>([
        { username: 'Alice', text: 'Great post!' },
        { username: 'Bob', text: 'Amazing content! This is a longer comment to test line wrapping.' }]);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [newComment, setNewComment] = useState<string>('');
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [post, setPost] = useState<Post | null>(null); // Post is initially null

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get<Post>('/api/posts/id/1');
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, []);

    const addComment = () => {
        if (newComment.trim()) {
            setComments([...comments, { username: 'me', text: newComment }]);
            setNewComment('');
        }
    }

    const editPost = () => {
        console.log('Edit post logic goes here');
        setShowMenu(false);
    };

    const deletePost = () => {
        console.log('Delete post logic goes here');
        setShowMenu(false);
    };

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
                            <button onClick={editPost} className={styles['post-menu-item']}>Edit</button>
                            <button onClick={deletePost} className={styles['post-menu-item']}>Delete</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Post Image */}
            <img src={post?.imagePath} alt="post" className={styles['post-image']} />

            {/* Bottom Bar */}
            <div className={styles['post-bottom-bar']}>
                <div className={styles['post-bottom-icons']}>
                    <FaHeart className={styles['post-icon']} />
                    <FaComment className={styles['post-icon']} onClick={() => setShowComments(!showComments)} />
                </div>
            </div>

            {/* Likes and Description */}
            <div className={styles['post-likes-description']}>
                {/* <span className='post-likes-count'>{post?.likesCount} likes</span> */}
                <p className={styles['post-description']}>
                    <span className={styles['post-author-name']}>{post?.user.username}: </span>
                    {post?.description}
                </p>
            </div>

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
