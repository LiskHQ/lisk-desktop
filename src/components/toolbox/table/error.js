import React from 'react';
import styles from '../box/emptyState.css';
import Illustration from '../illustration';

const Error = ({ data, isLoading }) => {
  const notFoundReg = /not\sfound/gi;
  if (isLoading || !data || (typeof data === 'string' ? notFoundReg.test(data) : notFoundReg.test(data.message))) {
    return null;
  }
  return (
    <div className={`${styles.wrapper} error-state`}>
      <Illustration name="emptyWallet" />
      <h3>{ typeof data === 'string' ? data : data.message }</h3>
    </div>
  );
};

export default Error;
