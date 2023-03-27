import React from 'react';
import boxStyles from 'src/theme/box/emptyState.css';
import Illustration from 'src/modules/common/components/illustration';
import styles from './styles.css';

const NotFound = ({ t }) => (
  <div className={`${boxStyles.wrapper} ${styles.emptyState} not-found-state`}>
    <Illustration name="emptyWallet" />
    <h3>{t('The transaction was not found.')}</h3>
    <p>
      {t(
        'If you just made the transaction, it will take up to a few minutes to be included in the blockchain. Please open this page later.'
      )}
    </p>
  </div>
);

export default NotFound;
