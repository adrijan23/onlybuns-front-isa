import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

const ActivateAccount: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const activateAccount = async () => {
            const token = searchParams.get('token');
            try {
                const response = await axios.get(`/auth/activate?token=${token}`);
                setMessage(response.data);
            } catch (err) {
                setMessage('Activation failed. Invalid token.');
            }
        };

        activateAccount();
    }, [searchParams]);

    return <div>{message} <Link to={'/login'}>Login</Link></div>;
};

export default ActivateAccount;
