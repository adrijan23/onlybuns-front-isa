import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8082',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const expirationTime = localStorage.getItem('tokenExpiration');
    const currentTime = new Date().getTime();

    if (token && expirationTime && currentTime < Number(expirationTime)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Handle token expiration (e.g., redirect to login page)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiration');
      window.location.href = '/login';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
