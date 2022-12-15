import React from 'react';

import EmptyBoxState from '@theme/box/emptyState';
import Illustration from 'src/modules/common/components/illustration';
import styles from './stakeForm.css';

const EmptyState = ({ t }) => (
  <EmptyBoxState className={styles.emptyState}>
    <Illustration name="emptyWallet" />
    <p>{t('No stakes in queue.')}</p>
  </EmptyBoxState>
);

export default EmptyState;
