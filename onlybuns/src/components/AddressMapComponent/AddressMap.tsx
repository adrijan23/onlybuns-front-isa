import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});


const AddressMap: React.FC<{
  latitude: number | null;
  longitude: number | null;
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
  setStreet: (street: string) => void;
  setStreetNumber: (streetNumber: string) => void;
  setCity: (city: string) => void;
  }> = ({ latitude, longitude, setLatitude, setLongitude, setStreet, setStreetNumber, setCity }) => {
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

      // Fetch address details using a reverse geocoding service
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data.address) {
      setStreet(data.address.road || '');
      setStreetNumber(data.address.house_number || '');
      setCity(data.address.city || data.address.town || data.address.village || '');
      }
    },
    });
    return null;
  };
  
  return (
    <MapContainer center={defaultPosition} zoom={13} style={{ height: '300px', width: '100%' }}>
    <TileLayer
      attribution="© OpenStreetMap contributors"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {latitude && longitude && <Marker position={[latitude, longitude]} />}
    <MapClickHandler />
    </MapContainer>
  );
  };

  export default AddressMap;
  