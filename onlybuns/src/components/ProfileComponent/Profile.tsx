import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Profile: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) throw new Error("AuthContext is undefined!");

    const { auth, logout } = authContext;

    return (
        <div>
            <h1>Welcome, {auth.user?.username}</h1>
            <p>Email: {auth.user?.email}</p>
            <p>Roles: {auth.user?.roles.map(role => role.name).join(', ')}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Profile;
