import React from 'react';
import styles from '../box/emptyState.css';
import Illustration from '../illustration';

const Error = ({ data, isLoading }) => {
  if (isLoading || !data || data.message === 'Not found') return null;
  return (
    <div className={`${styles.wrapper} error-state`}>
      <Illustration name="emptyWallet" />
      <h3>{ typeof data === 'string' ? data : data.message }</h3>
    </div>
  );
};

export default Error;
