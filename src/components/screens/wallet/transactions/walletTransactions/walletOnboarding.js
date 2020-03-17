import React from 'react';
import Onboarding from '../../../../toolbox/onboarding/onboarding';

export default function WalletOnboarding({
  t,
}) {
  function getOnboardingSlides() {
    return [{
      title: t('Manage your LSK with ease'),
      content: t('Send, request and receive LSK in one place! You can even attach personal message to each outgoing transaction.'),
      illustration: 'manageYourLSK',
    }, {
      title: t('Dive into the details'),
      content: t('View the full history of your account, including; voting, incoming and outgoing transactions.'),
      illustration: 'diveIntoDetails',
    }];
  }
  return (
    <Onboarding
      slides={getOnboardingSlides()}
      actionButtonLabel={t('Got it, thanks!')}
      name="walletOnboarding"
    />
  );
}
