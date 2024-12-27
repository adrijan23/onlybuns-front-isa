import React from 'react';
import PostAnalytics from '../components/Analytics/PostAnalytics';
import CommentAnalytics from '../components/Analytics/CommentAnalytics';
import UsersAnalytics from '../components/Analytics/UsersAnalytics';


const AnalyticsPage: React.FC = () => {
    const styles = {
        analyticsContainer: {
            display: 'flex',
            justifyContent: 'space-between', // or 'space-around', 'center', etc.
            gap: '20px', // optional: to add space between items
        },
        analyticsItem: {
            flex: 1, // Makes the items take up equal space, or you can set specific widths (e.g., 'width: 45%')
        },
    };
    return (
        <div>
            <div style={styles.analyticsContainer}>
                <div style={styles.analyticsItem}>
                    <PostAnalytics />
                </div>
                <div style={styles.analyticsItem}>
                    <UsersAnalytics />
                </div>
            </div>
            <CommentAnalytics />
        </div>
    );
};

export default AnalyticsPage;