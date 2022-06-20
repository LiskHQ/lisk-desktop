import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  selectActiveToken,
  selectActiveTokenAccount,
  selectCurrentBlockHeight,
} from 'src/redux/selectors';
import routes from 'src/routes/routes';
import { SecondaryButton } from 'src/theme/buttons';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import BoxEmptyState from 'src/theme/box/emptyState';
import Icon from 'src/theme/Icon';
import Table from 'src/theme/table';
import TransactionRow from '../TransactionRow';
import styles from './RecentTransactions.css';
import header from './RecentTransactionsHeaderMap';

export const NoTransactions = withTranslation()(({ t }) => {
  const activeToken = useSelector(selectActiveToken);
  return (
    <BoxEmptyState>
      <Icon name="iconEmptyRecentTransactions" />
      <h1>{t('No transactions yet')}</h1>
      <p>
        {t(
          'A great way to start is to top up your account with some {{value}}.',
          { value: activeToken.key },
        )}
      </p>
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
  const account = useSelector(selectActiveTokenAccount);
  const [isLoaded, setLoaded] = useState(!!transactions.data.length);
  const token = useSelector(state => state.token);
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const activeToken = token.active;
  const host = account.summary?.address;

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
        <h2 className={styles.title}>
          {t('Recent {{value}} transactions', { value: activeToken })}
        </h2>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <Table
          data={transactions.data}
          isLoading={transactions.isLoading}
          row={TransactionRow}
          header={header(t)}
          error={
            transactions.error.code !== 404 ? transactions.error : undefined
          }
          canLoadMore={false}
          additionalRowProps={{
            activeToken,
            host,
            currentBlockHeight,
            layout: 'minimal',
            avatarSize: 40,
          }}
          emptyState={account.passphrase ? NoTransactions : NotSignedIn}
        />
        <div className={styles.viewAll}>
          <Link to={routes.wallet.path} className="view-all">
            <SecondaryButton size="s">{t('View all')}</SecondaryButton>
          </Link>
        </div>
      </BoxContent>
    </Box>
  );
};

export default RecentTransactions;
