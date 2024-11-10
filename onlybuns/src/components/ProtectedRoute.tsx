import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface Props {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const authContext = useContext(AuthContext);

    if (!authContext) throw new Error("AuthContext is undefined!");

    const { auth } = authContext;

    if (auth.loading) return <div>Loading...</div>;

    return auth.accessToken ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
