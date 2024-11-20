import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Feed.module.css';
import Post from '../FeedPost/FeedPost';

interface User {
    id: number;
    username: string
}
interface PostData {
    id: number;
    description: string;
    imagePath: string;
    address: string;
    createdAt: Array<number>;
    user: User;
    likeCount:number;
}

const Feed: React.FC = () => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Utility function to sort posts by `createdAt`
    const sortPostsByDate = (posts: PostData[]): PostData[] => {
        return posts.sort((a, b) => {
            const dateA = new Date(
                a.createdAt[0],
                a.createdAt[1] - 1, // Month (0-based in JavaScript)
                a.createdAt[2],
                a.createdAt[3] || 0,
                a.createdAt[4] || 0,
                a.createdAt[5] || 0,
                Math.floor((a.createdAt[6] || 0) / 1e6) // Convert nanoseconds to milliseconds
            ).getTime();

            const dateB = new Date(
                b.createdAt[0],
                b.createdAt[1] - 1,
                b.createdAt[2],
                b.createdAt[3] || 0,
                b.createdAt[4] || 0,
                b.createdAt[5] || 0,
                Math.floor((b.createdAt[6] || 0) / 1e6)
            ).getTime();

            return dateB - dateA;
        });
};


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/posts'); // Adjust endpoint as needed
                const sortedPosts = sortPostsByDate(response.data);
                setPosts(sortedPosts);
            } catch (err) {
                setError('Failed to load posts. Please try again later.');
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className={styles.feedContainer}>
            <h2>Explore posts</h2>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.postsContainer}>
                {posts.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default Feed;
