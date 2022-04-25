import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectAccount, selectCurrentBlockHeight } from '@common/store/selectors';
import routes from '@screens/router/routes';
import { tokenMap } from '@token/configuration/tokens';
import { SecondaryButton } from '@basics/buttons';
import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import BoxEmptyState from '@basics/box/emptyState';
import Icon from '@basics/icon';
import Table from '@basics/table';
import TransactionRow from '@transaction/list/row';
import styles from './recentTransactions.css';
import header from './tableHeader';

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
        <h2 className={styles.title}>{t('Recent {{value}} transactions', { value: activeToken })}</h2>
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
