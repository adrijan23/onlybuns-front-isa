import React from 'react';
import AdminUsers from '../components/AdminUsers/AdminUsers';
import { Link } from 'react-router-dom';


const UsersPage: React.FC = () => {
  return (
    <div >
      <AdminUsers />
      <Link to="/analytics">
        <button>Check Analytics</button>
      </Link>
    </div>
  );
};

export default UsersPage;