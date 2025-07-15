import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



interface PostImageProps {
    imagePath: string;
    postId: number;
}

const PostImage: React.FC<PostImageProps> = ({ imagePath, postId }) => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log('PostImage rendered');
    }, []);

    const handleClick = () => {
        navigate(`/post/${postId}`);
    };

    return (
        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
            <img src={`http://localhost:8082/${imagePath}`} alt="Post" style={{ width: '100%', height: 'auto' }} />
        </div>
    );
};

export default PostImage;