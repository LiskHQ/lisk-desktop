import React from 'react';
import NetworkApplicationSelector from '@network/components/NetworkApplicationSelector/NetworkApplicationSelector';
import styles from './DialogNetworkApplicationSelector.css';

const DialogNetworkApplicationSelector = () => (
  <div className={styles.DialogNetworkApplicationSelector}>
    <NetworkApplicationSelector />
  </div>
);

export default DialogNetworkApplicationSelector;
