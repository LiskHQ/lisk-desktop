import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useCurrentAccount } from '@account/hooks';
import Overview from '@wallet/components/overview/overviewManager';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxTabs from '@theme/tabs';
import BoxContent from '@theme/box/content';
import Transactions from '@transaction/components/Explorer';
import TransactionEvents from '@transaction/components/TransactionEvents';
import { selectActiveToken, selectSettings, selectTransactions } from 'src/redux/selectors';
import InfoBanner from '@common/components/infoBanner/infoBanner';
import styles from './AccountOverview.css';

export default function AccountOverview({ address: searchAddress }) {
  const { t } = useTranslation();
  const activeToken = useSelector(selectActiveToken);
  const { discreetMode } = useSelector(selectSettings);
  const { confirmed } = useSelector(selectTransactions);
  const [activeTab, setActiveTab] = useState('transactions');
  const [
    {
      metadata: { address: currentAddress },
    },
  ] = useCurrentAccount();

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
  const accountAddress = searchAddress ?? currentAddress;

  return (
    <section>
      <InfoBanner
        t={t}
        name="accountManagementPageBanner"
        infoLabel={t('New')}
        infoMessage={t('Introducing account management')}
        infoDescription={t(
          'Effortlessly manage multiple accounts in one interface with enhanced privacy and security. Seamlessly switch between accounts, allocate funds, and monitor balances.'
        )}
        illustrationName="accountManagement"
        show
      />
      <Overview
        isWalletRoute
        activeToken={activeToken}
        discreetMode={discreetMode}
        transactions={confirmed}
      />
      <Box>
        <BoxHeader>
          <BoxTabs {...tabs} />
        </BoxHeader>
        <BoxContent className={styles.content}>
          {activeTab === 'transactions' ? (
            <Transactions address={accountAddress} />
          ) : (
            <TransactionEvents isWallet hasFilter address={accountAddress} />
          )}
        </BoxContent>
      </Box>
    </section>
  );
}
