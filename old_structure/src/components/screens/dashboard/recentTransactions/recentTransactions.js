import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectAccount, selectCurrentBlockHeight } from '@store/selectors';
import { routes, tokenMap } from '@constants';
import { SecondaryButton } from '@toolbox/buttons';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import BoxEmptyState from '@toolbox/box/emptyState';
import Icon from '@toolbox/icon';
import Table from '@toolbox/table';
import styles from './recentTransactions.css';
import header from './tableHeader';
import TransactionRow from './transactionRow';

export const NoTransactions = withTranslation()(({ t }) => {
  const activeToken = useSelector(state => tokenMap[state.settings.token.active]);
  return (
    <BoxEmptyState>
      <Icon name="iconEmptyRecentTransactions" />
      <h1>{t('No transactions yet')}</h1>
      <p>{t('A great way to start is to top up your account with some {{value}}.', { value: activeToken.key })}</p>
    </BoxEmptyState>
  );
});

export const NotSignedIn = withTranslation()(({ t }) => (
  <BoxEmptyState>
    <Icon name="iconEmptyRecentTransactions" />
    <h1>{t('Sign in to view recent transactions')}</h1>
    <p>{t('In order to see your recent transactions you need to sign in.')}</p>
  </BoxEmptyState>
));

const RecentTransactions = ({ className, t, transactions }) => {
  const account = useSelector(selectAccount);
  const [isLoaded, setLoaded] = useState(!!transactions.data.length);
  const settings = useSelector(state => state.settings);
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const activeToken = settings.token.active;
  const host = account.info && account.info[activeToken] ? account.info[activeToken].summary.address : '';

  useEffect(() => {
    if (host && !isLoaded) {
      setLoaded(true);
      transactions.loadData();
    }
  }, [host]);

  return (
    <Box
      isLoading={transactions.isLoading}
      className={`${styles.box} ${className}`}
    >
      <BoxHeader>
        <h2 className={styles.title}>{t('Recent {{value}} transactions', { value: activeToken.label })}</h2>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <Table
          data={transactions.data}
          isLoading={transactions.isLoading}
          row={TransactionRow}
          header={header(t)}
          error={transactions.error.code !== 404 ? transactions.error : undefined}
          canLoadMore={false}
          additionalRowProps={{
            t,
            activeToken: activeToken.key,
            host,
            currentBlockHeight,
          }}
          emptyState={account.passphrase ? NoTransactions : NotSignedIn}
        />
        <div className={styles.viewAll}>
          <Link to={routes.wallet.path} className="view-all">
            <SecondaryButton size="s">
              {t('View all')}
            </SecondaryButton>
          </Link>
        </div>
      </BoxContent>
    </Box>
  );
};

export default RecentTransactions;
