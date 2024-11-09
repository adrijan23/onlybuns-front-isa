import React, { useState } from 'react';
import './auth.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../config/axiosConfig';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // New error message state
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/login', { username, password });

      if (response.status === 200) {
        const { accessToken, expiresIn } = response.data;
        const expirationTime = new Date().getTime() + expiresIn;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('tokenExpiration', expirationTime.toString());
        setErrorMessage(null); // Clear any previous error message
        navigate('/');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
        <p>Don't have an account yet? <Link to="/signup">Sign Up.</Link></p>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
