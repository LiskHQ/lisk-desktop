import React from 'react';
import MultiStep from '@shared/multiStep';
import Introduction from './introduction';
import Reclaim from './reclaim';
import styles from './index.css';

const ReclaimBalance = () => (
  <MultiStep className={styles.multiStep}>
    <Introduction />
    <Reclaim />
  </MultiStep>
);

export default ReclaimBalance;
