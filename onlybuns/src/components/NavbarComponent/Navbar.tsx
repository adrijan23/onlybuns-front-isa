import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext is undefined!');
  const { auth, logout } = authContext;

  return (
    <div className={styles.navbar}>
      <nav>
        {/* Link always visible */}
        <Link to="/feed" className={styles.link}>Feed</Link>

        {/* Links visible only if the user is logged in */}
        {auth.user ? (
          <>
            <Link to="/profile" className={styles.link}>Profile</Link>
            <Link to="/trends" className={styles.link}>Trends</Link>
            <Link to="/map" className={styles.link}>Posts near you</Link>
            <Link to="/chat" className={styles.link}>Chat</Link>
            <Link to="/createpost" className={styles.link}>Create Post</Link>
            {auth.user.roles?.some(role => role.name === "ROLE_ADMIN") && (
              <Link to="/admin/users" className={styles.link}>Users</Link>
            )}

            {/* Logout button */}
            <button className={styles.link} onClick={logout}>Logout</button>
          </>
        ) : (
          // Link shown only if the user is not logged in
          <Link to="/login" className={styles.link}>Login</Link>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
