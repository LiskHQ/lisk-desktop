import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectActiveToken } from 'src/redux/selectors';
import { useTransactions } from '@transaction/hooks/queries';
import { useCurrentAccount } from '@account/hooks';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
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

const RecentTransactions = ({ className, t }) => {
  const [currentAccount] = useCurrentAccount();
  const host = currentAccount?.metadata?.address;
  const { data: transactions } = useTransactions({ config: {
    params: { limit: 5, address: host },
    options: { enabled: !!host }
  }});
  const token = useSelector(state => state.token);
  const { data: { height: currentBlockHeight } } = useLatestBlock();

  return (
    <Box
      isLoading={transactions?.isLoading}
      className={`${styles.box} ${className}`}
    >
      <BoxHeader>
        <h2 className={styles.title}>
          {t('Recent {{value}} transactions', { value: token.active })}
        </h2>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <Table
          data={transactions?.data || []}
          isLoading={transactions?.isLoading}
          row={TransactionRow}
          header={header(t)}
          error={
            transactions?.error?.code !== 404 ? transactions?.error : undefined
          }
          canLoadMore={false}
          additionalRowProps={{
            activeToken: token.active,
            host,
            currentBlockHeight,
            layout: 'minimal',
            avatarSize: 40,
          }}
          emptyState={host ? NoTransactions : NotSignedIn}
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
