import React from 'react';
import boxStyles from '@basics/box/emptyState.css';
import Illustration from '@basics/illustration';
import styles from './transactionDetails.css';

const NotFound = ({ t }) => (
  <div className={`${boxStyles.wrapper} ${styles.emptyState} not-found-state`}>
    <Illustration name="emptyWallet" />
    <h3>{t('The transaction was not found.')}</h3>
    <p>{t('If you just made the transaction, it will take up to a few minutes to be included in the blockchain. Please open this page later.')}</p>
  </div>
);

export default NotFound;
