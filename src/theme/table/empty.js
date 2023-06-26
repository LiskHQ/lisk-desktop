/* eslint-disable complexity */
import React from 'react';
import { isReactComponent } from 'src/utils/helpers';
import Illustration from 'src/modules/common/components/illustration';
import styles from '../box/emptyState.css';

const Empty = ({ isListEmpty, isLoading, error, data, className, message }) => {
  if (isLoading || !isListEmpty || error) return null;

  if (isReactComponent(data)) {
    const Element = data;
    return <Element />;
  }

  return (
    <div className={`${styles.wrapper} ${className} empty-state`}>
      <Illustration name={data?.illustration ?? 'emptyWallet'} />
      <h3>{message || data?.message || 'Nothing found.'}</h3>
    </div>
  );
};

export default Empty;
