import React from 'react';
import { useSelector } from 'react-redux';
import Overview from '@wallet/components/overview/overviewManager';
import { selectActiveToken, selectSettings, selectTransactions } from 'src/redux/selectors';
import SwippableInfoBanner from '@common/components/infoBanner/swippableInfoBanner';
import banners from './banners';

// eslint-disable-next-line max-statements
export default function AccountOverview() {
  const activeToken = useSelector(selectActiveToken);
  const { discreetMode } = useSelector(selectSettings);
  const { confirmed } = useSelector(selectTransactions);

  return (
    <section>
      <SwippableInfoBanner banners={banners} name="walletPageBanner" />
      <Overview
        isWalletRoute
        activeToken={activeToken}
        discreetMode={discreetMode}
        transactions={confirmed}
      />
    </section>
  );
}
