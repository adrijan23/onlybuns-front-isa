import React, { useState, useEffect } from 'react';
import axios from '../config/axiosConfig';
import StatCard from '../components/StatCardComponent/StatCard';
import PostList from '../components/PostListComponent/PostList';
import UserList from '../components/UserListComponent/UserList';


const TrendsPage: React.FC = () => {
  const [totalPosts, setTotalPosts] = useState<number | null>(null);
  const [monthlyPosts, setMonthlyPosts] = useState<number | null>(null);
  const [topPostsWeekly, setTopPostsWeekly] = useState<any[]>([]);
  const [topPostsAllTime, setTopPostsAllTime] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'weekly' | 'allTime'>('weekly');

  useEffect(() => {
    fetchTotalPosts();
    fetchMonthlyPosts();
    fetchTopPostsWeekly();
    fetchTopPostsAllTime();
    fetchTopUsers();
  }, []);

  const fetchTotalPosts = async () => {
    try {
      const response = await axios.get('/api/posts/count/total');
      setTotalPosts(response.data);
    } catch (error) {
      console.error('Error fetching total posts:', error);
    }
  };

  const fetchMonthlyPosts = async () => {
    try {
      const response = await axios.get('/api/posts/count/last-month');
      setMonthlyPosts(response.data);
    } catch (error) {
      console.error('Error fetching monthly posts:', error);
    }
  };

  const fetchTopPostsWeekly = async () => {
    try {
      const response = await axios.get('/api/posts/top-weekly');
      setTopPostsWeekly(response.data);
    } catch (error) {
      console.error('Error fetching top weekly posts:', error);
    }
  };

  const fetchTopPostsAllTime = async () => {
    try {
      const response = await axios.get('/api/posts/top-all-time');
      setTopPostsAllTime(response.data);
    } catch (error) {
      console.error('Error fetching top all-time posts:', error);
    }
  };

  const fetchTopUsers = async () => {
    try {
      const response = await axios.get('/api/users/top-likers-weekly');
      setTopUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching top users:', error);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Trends</h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
        {totalPosts !== null && <StatCard number={totalPosts} heading="Total Posts" />}
        {monthlyPosts !== null && <StatCard number={monthlyPosts} heading="Posts This Month" />}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            border: '1px solid #007bff',
            background: activeView === 'weekly' ? '#007bff' : 'transparent',
            color: activeView === 'weekly' ? '#fff' : '#007bff',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => setActiveView('weekly')}
        >
          Top Weekly Posts
        </button>
        <button 
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            border: '1px solid #007bff',
            background: activeView === 'allTime' ? '#007bff' : 'transparent',
            color: activeView === 'allTime' ? '#fff' : '#007bff',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => setActiveView('allTime')}
        >
          Top All-Time Posts
        </button>
      </div>

      {activeView === 'weekly' ? (
        <PostList posts={topPostsWeekly} />
      ) : (
        <PostList posts={topPostsAllTime} />
      )}

      <UserList users={topUsers} />
    </div>
  );
};

export default TrendsPage;
