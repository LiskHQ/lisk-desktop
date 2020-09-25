import React from 'react';
import Illustration from '../../../toolbox/illustration';
import EmptyBoxState from '../../../toolbox/box/emptyState';
import styles from '../../../toolbox/box/emptyState.css';

const Empty = ({
  message, className,
}) => (
  <EmptyBoxState className={`${styles.wrapper} ${className} empty-state`}>
    <Illustration name="emptyWallet" />
    <h3>{message}</h3>
  </EmptyBoxState>
);

export default Empty;
