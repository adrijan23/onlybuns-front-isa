import React from 'react';
import styles from './UserList.module.css'; // Import CSS module

interface User {
  id: number;
  name: string;
  likesGiven: number;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Top Users</h3>
      <ul className={styles.list}>
        {users.map((user) => (
          <li key={user.id} className={styles.user}>
            <span className={styles.name}>{user.name}</span>
            <span className={styles.likes}>- {user.likesGiven} likes</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
