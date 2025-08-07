import React from 'react';
import styles from './UserList.module.css'; // Import CSS module
import { Link } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  profileImage: string;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className={styles['user-list-container']}>
      <h3 className={styles['list-heading']}>Top Users</h3>
      <div className={styles['user-list']}>
        {users.map((user) => (
          <div key={user.id} className={styles['user-item']}>
            <Link to={`/profile/${user.id}`} className={styles['user-link']}>
              <img
                src={user.profileImage ? `http://localhost:8082/${user.profileImage}` : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                alt={`${user.firstName} ${user.lastName}`}
                className={styles['user-avatar']}
              />
              <div className={styles['user-info']}>
                <span className={styles['user-name']}>{`${user.firstName} ${user.lastName}`}</span>
                <span className={styles['user-username']}>@{user.username}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
