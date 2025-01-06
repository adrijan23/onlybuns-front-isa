import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import style from './NearbyMap.module.css';

// Fix Leaflet marker icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import postIconImage from '../../icons/rabbit-i.png'; // Import your custom post icon image
import FeedPost from '../FeedPost/FeedPost';
import PostImage from '../PostImageComponent/PostImage';

L.Marker.prototype.options.icon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});

const postIcon = L.icon({
    iconUrl: postIconImage,
    iconSize: [35, 35], // Adjust the size as needed
    iconAnchor: [12, 41], // Adjust the anchor as needed
    popupAnchor: [1, -34], // Adjust the popup anchor as needed
    shadowUrl: iconShadow,
});

interface Address {
    street: string;
    streetNumber: string;
    city: string;
    latitude: number;
    longitude: number;
}

interface User {
    id: number;
    username: string;
}

interface Post {
    id: number;
    description: string;
    imagePath: string;
    latitude: number;
    longitude: number;
    createdAt: Array<number>;
    user: User;
}

interface NearbyMapProps {
    latitude: number | null;
    longitude: number | null;
    posts: Post[];
    setLatitude: (lat: number) => void;
    setLongitude: (lng: number) => void;
}

const NearbyMap: React.FC<NearbyMapProps> = ({ latitude, longitude, posts, setLatitude, setLongitude }) => {
    const defaultPosition: [number, number] = latitude && longitude
        ? [latitude, longitude]
        : [51.505, -0.09]; // Default to London coordinates

    // Custom Map Events Hook
    const MapClickHandler = () => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setLatitude(lat);
                setLongitude(lng);
            },
        });
        return null;
    };

    console.log('Posts:', posts);
    posts.forEach(post => console.log(`Post ID: ${post.id}, Latitude: ${post.latitude}, Longitude: ${post.longitude}`));

    return (
        <MapContainer center={defaultPosition} zoom={13} style={{ height: '700px', width: '100%' }}>
            <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {latitude && longitude && <Marker position={[latitude, longitude]} />}
            {posts.map(post => (
                <Marker key={post.id} position={[post.latitude, post.longitude]} icon={postIcon}>
                    <Popup>    
                        <PostImage imagePath={post.imagePath} postId={post.id} />
                    </Popup>
                </Marker>
            ))}
            <MapClickHandler />
        </MapContainer>
    );
};

export default NearbyMap;