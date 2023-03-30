/* eslint-disable max-statements */
/* istanbul ignore file */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import { parseSearchParams, addSearchParamsToUrl } from 'src/utils/searchParams';
import { selectActiveToken, selectSettings, selectTransactions } from 'src/redux/selectors';
import Transactions from '@transaction/components/Explorer';
import Overview from '@wallet/components/overview/overviewManager';

import Box from 'src/theme/box';
import BoxTabs from 'src/theme/tabs';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import TransactionEvents from '@transaction/components/TransactionEvents';
import { useCurrentAccount } from '../../hooks';
import styles from './accountDetails.css';

const AccountDetails = ({ history }) => {
  const { t } = useTranslation();
  const [
    {
      metadata: { address: currentAddress },
    },
  ] = useCurrentAccount();
  const activeToken = useSelector(selectActiveToken);
  const { discreetMode } = useSelector(selectSettings);
  const { confirmed } = useSelector(selectTransactions);
  const [activeTab, setActiveTab] = useState('transactions');

  const tabs = {
    tabs: [
      {
        value: 'transactions',
        name: t('Transactions'),
        className: 'transactions',
      },
      {
        value: 'events',
        name: t('Events'),
        className: 'events',
      },
    ],
    active: activeTab,
    onClick: ({ value }) => setActiveTab(value),
  };

  useEffect(() => {
    const params = parseSearchParams(history.location.search);
    if (params.recipient !== undefined) {
      addSearchParamsToUrl(history, { modal: 'send' });
    }
  }, []);
  return (
    <section>
      <Overview
        isWalletRoute
        activeToken={activeToken}
        discreetMode={discreetMode}
        transactions={confirmed}
      />
      <Box className={styles.wrapper}>
        <BoxHeader>
          <BoxTabs {...tabs} />
        </BoxHeader>
        <BoxContent className={styles.content}>
          {activeTab === 'transactions' ? (
            <Transactions address={currentAddress} />
          ) : (
            <TransactionEvents isWallet hasFilter address={currentAddress} />
          )}
        </BoxContent>
      </Box>
    </section>
  );
};

export default compose(withRouter)(AccountDetails);
