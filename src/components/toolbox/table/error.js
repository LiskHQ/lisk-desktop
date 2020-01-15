import React from 'react';
import styles from '../box/emptyState.css';
import Illustration from '../illustration';

const Error = ({ message, isLoading }) => {
  if (isLoading || !message) return null;
  return (
    <div className={`${styles.wrapper} error-state`}>
      <Illustration name="emptyWallet" />
      <h3>{ message }</h3>
    </div>
  );
};

export default Error;
