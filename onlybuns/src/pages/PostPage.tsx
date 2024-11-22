import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FeedPost from '../components/FeedPost/FeedPost'; // Adjust the import path based on your project structure

interface User {
  id: number;
  username: string;
}

interface Post {
  id: number;
  description: string;
  imagePath: string;
  user: User;
  likeCount: number;
}

const PostPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/posts/id/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to fetch the post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!post) {
    return <p>No post found.</p>;
  }

  return (
    <div>
      <FeedPost post={post} />
    </div>
  );
};

export default PostPage;
