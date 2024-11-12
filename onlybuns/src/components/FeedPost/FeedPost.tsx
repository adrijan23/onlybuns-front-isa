import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './FeedPost.module.css';

interface PostProps {
    post: {
        id: number;
        description: string;
        imagePath: string;
        address: string;
        createdAt: Array<number>;
        user: {
            username: string;
        };
    };
}

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: {
        username: string;
    };
}

const Post: React.FC<PostProps> = ({ post }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    console.log(post)

    // Function to fetch comments
    const fetchComments = async () => {
        if (comments.length === 0 && !loading) {
            setLoading(true);
            try {
                const response = await axios.get(`/api/posts/${post.id}/comments`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    // Toggle comments visibility and fetch them if not already fetched
    const handleShowComments = () => {
        setShowComments(!showComments);
        if (!showComments && comments.length === 0) {
            fetchComments();
        }
    };

    return (
        <div className={styles.postContainer}>
            {/* Post Header */}
            <div className={styles.postTopBar}>
                <div className={styles.postAuthorInfo}>
                    <span className={styles.postAuthorName}>{post.user.username}</span>
                </div>
            </div>

            {/* Post Image */}
            <img
    src={`http://localhost:8082/${post.imagePath}`}
    alt="Post"
    className={styles.postImage}
    crossOrigin="anonymous"
/>



            {/* Post Description */}
            <div className={styles.postDescription}>
                <p>
                    <span className={styles.postAuthorName}>{post.user.username}: </span>
                    {post.description}
                </p>
            </div>

            {/* Show Comments Link */}
            <p onClick={handleShowComments} className={styles.showCommentsLink}>
                {showComments ? 'Hide Comments' : 'Show Comments'}
            </p>


            {/* Comments Section */}
            {showComments && (
                <div className={styles.postCommentSection}>
                    {loading ? (
                        <p>Loading comments...</p>
                    ) : comments.length > 0 ? (
                        <ul className={styles.postCommentList}>
                            {comments.map((comment) => (
                                <li key={comment.id} className={styles.postCommentItem}>
                                    <span className={styles.postCommentUsername}>{comment.user.username}: </span>
                                    <span className={styles.postCommentText}>{comment.content}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Post;
