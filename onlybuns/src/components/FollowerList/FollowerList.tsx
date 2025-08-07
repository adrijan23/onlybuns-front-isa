import React from 'react';
import { Link } from 'react-router-dom';
import styles from './FollowerList.module.css';

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

interface FollowerListProps {
  users: User[]; // Accepts a list of users as a prop
}

const FollowerList: React.FC<FollowerListProps> = ({ users }) => {
  return (
    <div className={styles['follower-list-container']}>
      {users.map((user) => (
        <div key={user.id} className={styles['follower-list-item']}>
          <Link to={`/profile/${user.id}`} className={styles['follower-link']}>
            <span className={styles['follower-name']}>{`${user.firstName} ${user.lastName}`}</span>
            <span className={styles['follower-username']}>@{user.username}</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default FollowerList;
