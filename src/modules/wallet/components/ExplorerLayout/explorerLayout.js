/* istanbul ignore file */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import BoxTabs from 'src/theme/tabs';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { selectSearchParamValue } from 'src/utils/searchParams';
import Transactions from '@transaction/components/Explorer';
import TransactionEvents from '@transaction/components/TransactionEvents';
import Overview from '../overview/overviewManager';
import styles from './explorerLayout.css';

const ExplorerLayout = ({ history }) => {
  const { t } = useTranslation();
  const address = selectSearchParamValue(history.location.search, 'address');
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

  return (
    <section>
      <Overview />
      <Box>
        <BoxHeader>
          <BoxTabs {...tabs} />
        </BoxHeader>
        <BoxContent className={styles.containerContent}>
          {activeTab === 'transactions' ? (
            <Transactions pending={[]} address={address} />
          ) : (
            <TransactionEvents isWallet address={address} />
          )}
        </BoxContent>
      </Box>
    </section>
  );
};

export default ExplorerLayout;
