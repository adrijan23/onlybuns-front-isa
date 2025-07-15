import React, { useEffect, useState, useContext } from 'react';
import NearbyMap from '../components/NearbyMapComponent/NearbyMap'; // Adjust the import path as necessary
import { AuthContext } from '../context/AuthContext'; // Adjust the import path as necessary
import axios from '../config/axiosConfig';

interface Address {
    street: string;
    streetNumber: string;
    city: string;
    latitude: number;
    longitude: number;
}

const NearbyMapPage: React.FC = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error('AuthContext is undefined!');
    const { auth } = authContext;
    const userId = auth.user?.id;

    const [posts, setPosts] = useState([]);
    const [address, setAddress] = useState<Address | null>(null);
    const [isAddressLoaded, setIsAddressLoaded] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserAddress = async () => {
            try {
                const response = await axios.get(`/api/user/${userId}/address`);
                setAddress(response.data); // If address exists, it gets set here
            } catch (error) {
                console.error('Error fetching user address:', error);
                setAddress(null); // If there's an error or no address, set null
            } finally {
                setTimeout(() => {
                    setIsAddressLoaded(true); // Give enough time to fetch the address
                }, 500); // Wait 500ms before considering the address "loaded"
            }
        };

        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        if (userId) {
            fetchUserAddress();
            fetchPosts();
        }
    }, [userId]);

    const defaultLatitude = 51.5074; // Default London latitude
    const defaultLongitude = -0.1278; // Default London longitude

    return (
        <div>
            <h1>Nearby</h1>
            {!isAddressLoaded ? (
                <p>Loading your location...</p>
            ) : (
                <NearbyMap
                    latitude={address?.latitude || defaultLatitude}
                    longitude={address?.longitude || defaultLongitude}
                    posts={posts}
                    setLatitude={(lat) =>
                        setAddress((prev) => (prev ? { ...prev, latitude: lat } : null))
                    }
                    setLongitude={(lng) =>
                        setAddress((prev) => (prev ? { ...prev, longitude: lng } : null))
                    }
                />
            )}
        </div>
    );
};


export default NearbyMapPage;