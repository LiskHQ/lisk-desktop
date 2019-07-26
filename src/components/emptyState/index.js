// istanbul ignore file
import React from 'react';
import styles from './emptyState.css';

const EmptyState = ({ className = '', children }) => (
  <div className={`${styles.wrapper} ${className} empty-state`}>
    {children}
  </div>
);

export default EmptyState;
