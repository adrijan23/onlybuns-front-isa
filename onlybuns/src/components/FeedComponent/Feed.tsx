import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Feed.module.css';
import Post from '../FeedPost/FeedPost';

interface PostData {
    id: number;
    description: string;
    imagePath: string;
    address: string;
    createdAt: string;
    user: {
        username: string;
    };
}

const Feed: React.FC = () => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/posts'); // Adjust endpoint as needed
                const sortedPosts = response.data.sort((a: PostData, b: PostData) => 
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
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
