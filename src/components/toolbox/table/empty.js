import React from 'react';
import { isReactComponent } from '@utils/helpers';
import styles from '../box/emptyState.css';
import Illustration from '../illustration';

const Empty = ({
  isListEmpty, isLoading, data, error, className,
}) => {
  if (isLoading || !isListEmpty || (error && error.message !== 'Not found.')) return null;
  if (isReactComponent(data)) {
    const Element = data;
    return (<Element />);
  }
  return (
    <div className={`${styles.wrapper} ${className} empty-state`}>
      <Illustration name={data?.illustration ?? 'emptyWallet'} />
      <h3>{error?.message ?? 'Nothing found.'}</h3>
    </div>
  );
};

export default Empty;
