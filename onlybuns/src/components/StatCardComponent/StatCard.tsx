import React from 'react';
import styles from './StatCard.module.css'; // Import CSS module

interface StatCardProps {
  number: number;
  heading: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, heading }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>{heading}</h3>
      <p className={styles.number}>{number}</p>
    </div>
  );
};

export default StatCard;
