import React from 'react';
import styles from './emptyState.css';
import cubeImage from '../../assets/images/dark-blue-cube.svg';

const EmptyState = ({ title, message, className }) => (
  <div className={`${styles.emptyState} ${className}`}>
    <img src={cubeImage} />
    <h2 className='empty-message'>{title}</h2>
    <p>{message}</p>
  </div>
);

export default EmptyState;
