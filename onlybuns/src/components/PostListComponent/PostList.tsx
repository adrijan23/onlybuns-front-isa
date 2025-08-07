import React from 'react';
import FeedPost from '../FeedPost/FeedPost'; // Assuming this is the existing component
import styles from './PostList.module.css'; // Import CSS module

interface User {
    id: number;
    username: string;
}

interface Post{
    id: number;
    description: string;
    imagePath: string;
    user: User;
    likeCount: number;
};

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className={styles.list}>
      {posts.map((post) => (
        <FeedPost key={post.id} post={post} /> // Assuming `FeedPost` accepts a `post` prop
      ))}
    </div>
  );
};

export default PostList;
