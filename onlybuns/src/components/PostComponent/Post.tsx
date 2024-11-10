import React, { useState, useEffect } from 'react';
import { FaEllipsisH, FaHeart, FaComment } from 'react-icons/fa';
import './Post.css';
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
                const response = await axios.get<Post>('/api/posts/1');
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
        <div className="post-container">
            {/* Top Bar */}
            <div className="post-top-bar">
                <div className="post-author-info">
                    {/* <img src={post?.us} alt="author" className="post-profile-image" /> */}
                    <span className="post-author-name">{post?.user.username}</span>
                </div>
                <div className='post-menu'>
                    <FaEllipsisH className="post-menu-icon" onClick={() => setShowMenu(!showMenu)} />
                    {showMenu && (
                        <div className='post-menu-dropdown'>
                            <button onClick={editPost} className='post-menu-item'>Edit</button>
                            <button onClick={deletePost} className='post-menu-item'>Delete</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Post Image */}
            <img src={post?.imagePath} alt="post" className="post-image" />

            {/* Bottom Bar */}
            <div className="post-bottom-bar">
                <div className="post-bottom-icons">
                    <FaHeart className="post-icon" />
                    <FaComment className="post-icon" onClick={() => setShowComments(!showComments)} />
                </div>
            </div>

            {/* Likes and Description */}
            <div className='post-likes-description'>
                {/* <span className='post-likes-count'>{post?.likesCount} likes</span> */}
                <p className='post-description'>
                    <span className='post-author-name'>{post?.user.username}: </span>
                    {post?.description}
                </p>
            </div>

            {/* Comment Section */}
            {showComments && (
                <div className='post-comment-section'>
                    <ul className='post-comment-list'>
                        {comments.map((comment, index) => (
                            <li key={index} className='post-comment-item'>
                                <span className='post-comment-username'>{comment.username}: </span>
                                <span className='post-comment-text'>{comment.text}</span>
                            </li>
                        ))}
                    </ul>
                    <div className='post-comment-input-container'>
                        <input
                            type='text'
                            placeholder='Add a comment...'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className='post-comment-input'
                        />
                        <button onClick={addComment} className='post-add-comment-button'>
                            Add
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;
