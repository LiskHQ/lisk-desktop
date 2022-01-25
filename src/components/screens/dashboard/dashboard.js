// istanbul ignore file
import React from 'react';

import WalletDetails from '@shared/walletDetails';
import Onboarding from '@toolbox/onboarding/onboarding';
import InfoBanner from '@toolbox/infoBanner/infoBanner';
import NewsFeed from './newsFeed';
import RecentTransactions from './recentTransactions';
import styles from './dashboard.css';

const getOnboardingSlides = (t) => [
  {
    title: t('Ready to go!'),
    content: t(
      'The ultimate gateway to the ecosystem. Lisk’s new design lets you easily manage your LSK (and much, much more).',
    ),
    illustration: 'hubReadyToGo',
  },
  {
    title: t('Stay Informed'),
    content: t(
      'Keep up-to-date with announcements from the Lisk Foundation. Check what network delegates have been up to with dedicated profile pages.',
    ),
    illustration: 'builtAroundCommunity',
  },
  {
    title: t('Effortlessly send and receive tokens'),
    content: t(
      'Personalize each transaction with a custom message.',
    ),
    illustration: 'sendLSKTokens',
  },
  {
    title: t('Get Involved'),
    content: t(
      'Community is key. Vote for delegates, or register as one yourself. Feel like a feature is missing? Request it directly from the Lisk.',
    ),
    illustration: 'timeToContribute',
  },
];

const Dashboard = ({ account, t }) => {
  const isLoggedIn = !!account?.summary?.address;

  return (
    <>
      <div className={`${styles.wrapper} dashboard-container`}>
        <Onboarding
          slides={getOnboardingSlides(t)}
          actionButtonLabel={t('Got it, thanks!')}
          name="dashboardOnboarding"
        />
        <InfoBanner
          name="btcRemoval"
          infoMessage={t('Please note: BTC support has been removed as of Lisk v2.2.0.')}
          infoDescription={t('If you are affected by this change, please click the link below to learn how to access your BTC using an alternative application.')}
          infoLabel="Update"
          infoLink="https://lisk.com/blog/development/lisk-desktop-220-release"
        />
        <div className={`${styles.main}`}>
          <div className={styles.subContainer}>
            {isLoggedIn ? <WalletDetails className={styles.marginFix} /> : null}

            <RecentTransactions
              className={styles.marginFix}
              isLoggedIn={isLoggedIn}
            />
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
