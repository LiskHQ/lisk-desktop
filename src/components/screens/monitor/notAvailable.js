import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { PrimaryButton } from '../../toolbox/buttons/button';
import styles from './notAvailable.css';
import Illustration from '../../toolbox/illustration';
import routes from '../../../constants/routes';

const NotAvailable = ({
  t, history,
}) => (
  <div className={styles.container}>
    <div className={styles.wrapper}>
      <Illustration name="emptyWallet" />
      <h1 className="result-box-header">{t('Nothing to see here')}</h1>
      <p className="transaction-status body-message">{t('This feature is supported only for mainnet and testnet.')}</p>
      <PrimaryButton
        onClick={() => { history.push(routes.dashboard.path); }}
        className={styles.button}
      >
        {t('Go to Dashboard')}
      </PrimaryButton>
    </div>
  </div>
);

export default withRouter(withTranslation()(NotAvailable));
