import React, { useState } from 'react';
import { FaEllipsisH, FaHeart, FaComment } from 'react-icons/fa';
import './Post.css'; // Import the CSS file

interface PostProps {
    authorName: string;
    authorProfileImage: string;
    postImage: string;
}

const Post: React.FC<PostProps> = ({ authorName, authorProfileImage, postImage }) => {
    const [comments, setComments] = useState<string[]>(['Great post!', 'Amazing content!']);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [newComment, setNewComment] = useState<string>('');

    const addComment = () => {
        if (newComment.trim()) {
            setComments([...comments, newComment]);
            setNewComment('');
        }
    }

    return (
        <div className="post-container">
            {/* Top Bar */}
            <div className="top-bar">
                <div className="author-info">
                    <img src={authorProfileImage} alt="author" className="profile-image" />
                    <span className="author-name">{authorName}</span>
                </div>
                <FaEllipsisH className="menu-icon" />
            </div>

            {/* Post Image */}
            <img src={postImage} alt="post" className="post-image" />

            {/* Bottom Bar */}
            <div className="bottom-bar">
                <div className="bottom-icons">
                    <FaHeart className="icon" />
                    <FaComment className="icon" onClick={() => setShowComments(!showComments)} />
                </div>
            </div>

            {/* Comment Section */}
            {showComments && (
                <div className='comment-section'>
                    <ul className='comment-list'>
                        {comments.map((comment, index) => (
                            <li key={index} className='comment-item'>
                                {comment}
                            </li>
                        ))}
                    </ul>
                    <div className='comment-input-container'>
                        <input
                            type='text'
                            placeholder='Add a comment...'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className='comment-input'
                        />
                        <button onClick={addComment} className='add-comment-button'>
                            Add
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;
