// istanbul ignore file
import React from 'react';
import RecentTransactions from '@transaction/components/RecentTransactions';
import WalletDetails from '@token/fungible/manager/walletDetails';
import { useAccounts, useCurrentAccount } from '@account/hooks';
import AccountCreationTips from '@account/components/AccountCreationTips';
import { ManageAccountsContent } from '@account/components/ManageAccounts';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import { isEmpty } from 'src/utils/helpers';
import { useTokenBalances } from 'src/modules/token/fungible/hooks/queries';
import Onboarding from '../onboarding/onboarding';
import NewsFeed from '../newsFeed';
import styles from './dashboard.css';

const getOnboardingSlides = (t) => [
  {
    title: t('Ready to go!'),
    content: t(
      'The ultimate gateway to the ecosystem. Lisk’s new design lets you easily manage your LSK (and much, much more).'
    ),
    illustration: 'hubReadyToGo',
  },
  {
    title: t('Stay Informed'),
    content: t(
      'Keep up-to-date with announcements from the Lisk Foundation. Check what network validators have been up to with dedicated profile pages.'
    ),
    illustration: 'builtAroundCommunity',
  },
  {
    title: t('Effortlessly send and receive tokens'),
    content: t('Personalize each transaction with a custom message.'),
    illustration: 'sendLSKTokens',
  },
  {
    title: t('Get Involved'),
    content: t(
      'Community is key. Stake for validators, or register as one yourself. Feel like a feature is missing? Request it directly from the Lisk.'
    ),
    illustration: 'timeToContribute',
  },
];

const Dashboard = ({ t, history }) => {
  const { accounts } = useAccounts();
  const [currentAccount] = useCurrentAccount();
  const OnboardingBannerName = 'dashboardOnboarding';
  const tokens = useTokenBalances({
    config: {
      params: { limit: 2 },
    },
  });

  return (
    <>
      <div className={`${styles.wrapper} dashboard-container`}>
        <Onboarding
          slides={getOnboardingSlides(t)}
          actionButtonLabel={t('Got it, thanks!')}
          name={OnboardingBannerName}
        />
        <div className={`${styles.main}`}>
          <div className={styles.subContainer}>
            {!isEmpty(currentAccount) && (
              <>
                <WalletDetails
                  className={styles.marginFix}
                  isWalletRoute={false}
                  isLoading={tokens.isLoading}
                  tokens={tokens.data?.data}
                />
                <RecentTransactions isLoggedIn className={styles.marginFix} />
              </>
            )}
            {isEmpty(currentAccount) && accounts.length === 0 && <AccountCreationTips />}
            {isEmpty(currentAccount) && accounts.length > 0 && (
              <Box className={styles.wrapper}>
                <BoxHeader>
                  <h1>{t('Manage accounts')}</h1>
                </BoxHeader>
                <ManageAccountsContent
                  truncate
                  isRemoveAvailable
                  history={history}
                  className={styles.manageAccounts}
                />
              </Box>
            )}
          </div>

          <div className={`${styles.community} community-feed`}>
            <NewsFeed />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
