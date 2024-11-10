import React, { useContext,useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import L from 'leaflet';
import axios from '../../config/axiosConfig'
import styles from './CreatePost.module.css';
import 'leaflet/dist/leaflet.css';
import { AuthContext } from '../../context/AuthContext';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const CreatePost: React.FC = () => {
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
   const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext is undefined!');
  const { auth } = authContext;


  // Function to get address from coordinates using a reverse geocoding API
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      setAddress(response.data.display_name);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

const LocationMarker = () => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      console.log("Map clicked at:", e.latlng); // Debugging: Log coordinates
      setCoordinates(e.latlng);
      getAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
    },
  });

  return coordinates ? <Marker position={[coordinates.lat, coordinates.lng]} /> : null;
}

  // Handle image selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };
  const handleCreatePost = async () => {
    const postRequest = {
      description,
      address,
      userId: auth.user?.id,
      latitude: coordinates?.lat || null,
      longitude: coordinates?.lng || null,
    };
  
    // Create FormData and append the JSON and image correctly
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(postRequest)], { type: 'application/json' });
    formData.append('postRequest', jsonBlob);
  
    if (image) {
      formData.append('image', image);
    }
  
    try {
      // Send the request to the server
      const response = await axios.post('/api/posts', formData)
      console.log('Post created:', response.data);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  
  return (
    <div className={styles['create-post']}>
      <h2>Create Post</h2>
      <form>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter post description"
          required
        />

        <label>Upload Image (Rabbit):</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {/* Image Preview Section */}
        {imagePreview && (
          <div className={styles['image-preview']}>
            <img src={imagePreview} alt="Preview" style={{ width: '200px', height: 'auto', marginTop: '10px' }} />
          </div>
        )}

        <label>Location:</label>
        <input type="text" value={address} placeholder="Selected address" readOnly />

        <div className={styles['map-container']}>
          <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '300px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
          </MapContainer>
        </div>

        <button type="button" onClick={handleCreatePost}>
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;