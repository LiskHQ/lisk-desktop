import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectActiveToken } from 'src/redux/selectors';
import { useTransactions } from '@transaction/hooks/queries';
import { useCurrentAccount } from '@account/hooks';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import routes from 'src/routes/routes';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import BoxEmptyState from 'src/theme/box/emptyState';
import Icon from 'src/theme/Icon';
import { QueryTable } from '@theme/QueryTable';
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
  const [hasTxs, setHasTxs] = useState(false);
  const currentAddress = currentAccount?.metadata?.address;
  const token = useSelector(state => state.token);
  const { data: { height: currentBlockHeight } } = useLatestBlock();

  const onSuccess = (response) => {
    setHasTxs(response?.data?.length > 0);
  };

  return (
    <Box
      className={`${styles.box} ${className}`}
    >
      <BoxHeader>
        <h2 className={styles.title}>
          {t('Recent transactions')}
        </h2>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <QueryTable
          queryHook={useTransactions}
          queryConfig={{
            config: {
              params: { limit: 5, address: currentAddress },
              options: { enabled: !!currentAddress }
            },
          }}
          row={TransactionRow}
          header={header(t)}
          canLoadMore={false}
          additionalRowProps={{
            activeToken: token.active,
            host: currentAddress,
            currentBlockHeight,
            layout: 'minimal',
            avatarSize: 40,
          }}
          emptyState={currentAddress ? NoTransactions : NotSignedIn}
          onFetched={onSuccess}
        />
        {
          hasTxs && (
            <div className={styles.viewAll}>
              <Link to={routes.wallet.path} className="view-all">
                {t('View all')}
              </Link>
            </div>
          )
        }
      </BoxContent>
    </Box>
  );
};

export default RecentTransactions;
