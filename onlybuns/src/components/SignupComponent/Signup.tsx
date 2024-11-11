import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('/auth/signup', {
                username: formData.username,
                password: formData.password,
                firstname: formData.firstName,
                lastname: formData.lastName,
                email: formData.email,
            });

            if (response.status === 201) {
                setSuccess('Account created successfully! Check your email to activate your account.');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Signup</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Username:</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email:</label>
                    <input
                        className={styles.input}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>First Name:</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Last Name:</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Password:</label>
                    <input
                        className={styles.input}
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Confirm Password:</label>
                    <input
                        className={styles.input}
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
                <button className={styles.button} type="submit">Sign Up</button>
                <p>Already have account? <Link to={'/login'}>Login</Link></p>
            </form>
        </div>
    );
};

export default Signup;
