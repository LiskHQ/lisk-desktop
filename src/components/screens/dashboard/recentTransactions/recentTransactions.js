import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import routes from 'constants';
import { SecondaryButton } from '../../../toolbox/buttons';
import { getActiveTokenAccount } from 'utils/account';
import { tokenMap } from 'constants';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import Icon from '../../../toolbox/icon';
import styles from './recentTransactions.css';
import Table from '../../../toolbox/table';
import header from './tableHeader';
import TransactionRow from './transactionRow';

export const NoTransactions = withTranslation()(({ t }) => {
  const activeToken = useSelector(state => tokenMap[state.settings.token.active]);
  return (
    <BoxEmptyState>
      <Icon name="iconEmptyRecentTransactions" />
      <h1>{t('No Transactions Yet')}</h1>
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
  const account = useSelector(state => getActiveTokenAccount(state));
  const [isLoaded, setLoaded] = useState(!!transactions.data.length);
  // const bookmarks = useSelector(state => state.bookmarks);
  const settings = useSelector(state => state.settings);
  const activeToken = tokenMap[settings.token.active];

  useEffect(() => {
    if (account.passphrase && !isLoaded && !transactions.data.length) {
      setLoaded(true);
      transactions.loadData();
    }
  }, [account]);

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
          error={transactions.error}
          canLoadMore={false}
          additionalRowProps={{ t, activeToken: activeToken.key, host: account.address }}
          emptyState={account.passphrase ? NoTransactions : NotSignedIn}
        />
        <div className={styles.viewAll}>
          <Link to={routes.wallet.path} className="view-all">
            <SecondaryButton size="s">
              {t('View All')}
            </SecondaryButton>
          </Link>
        </div>
      </BoxContent>
    </Box>
  );
};

export default RecentTransactions;
