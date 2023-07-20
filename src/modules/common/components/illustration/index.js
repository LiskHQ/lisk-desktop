import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'src/theme/Theme';
import welcomeLiskValidators from '@setup/react/assets/images/illustrations/illustration-welcome-to-lisk-validators-dark.svg';
import yourVoiceMatters from '@setup/react/assets/images/illustrations/illustration-your-voice-matters-dark.svg';
import getRewarded from '@setup/react/assets/images/illustrations/illustration-get-rewarded-dark.svg';
import expandYourKnowledge from '@setup/react/assets/images/illustrations/illustration-expand-your-knowledge-dark.svg';
import ledgerNano from '@setup/react/assets/images/illustrations/illustration-ledger-nano-light.svg';
import ledgerNanoDark from '@setup/react/assets/images/illustrations/illustration-ledger-nano-dark.svg';
import transactionSuccess from '@setup/react/assets/images/illustrations/transaction-success.svg';
import transactionSuccessDark from '@setup/react/assets/images/illustrations/transaction-success-dark.svg';
import transactionPending from '@setup/react/assets/images/illustrations/transaction-pending.svg';
import transactionPendingDark from '@setup/react/assets/images/illustrations/transaction-pending-dark.svg';
import transactionError from '@setup/react/assets/images/illustrations/transaction-error.svg';
import transactionErrorDark from '@setup/react/assets/images/illustrations/transaction-error-dark.svg';
import stakingSuccessDark from '@setup/react/assets/images/illustrations/staking-submitted-dark.svg';
import stakingSuccess from '@setup/react/assets/images/illustrations/staking-submitted.svg';
import stakingError from '@setup/react/assets/images/illustrations/staking-error.svg';
import stakingErrorDark from '@setup/react/assets/images/illustrations/staking-error-dark.svg';
import pageNotFound from '@setup/react/assets/images/illustrations/illustration-page-not-found.svg';
import pageNotFoundDark from '@setup/react/assets/images/illustrations/illustration-page-not-found-dark.svg';
import errorBoundaryPage from '@setup/react/assets/images/illustrations/illustration-error-boundary-page.svg';
import errorBoundaryPageDark from '@setup/react/assets/images/illustrations/illustration-error-boundary-page-dark.svg';
import hubReadyToGo from '@setup/react/assets/images/illustrations/hub-ready-togo.svg';
import builtAroundCommunity from '@setup/react/assets/images/illustrations/built-around-community.svg';
import sendLSKTokens from '@setup/react/assets/images/illustrations/send-lsk-tokens.svg';
import timeToContribute from '@setup/react/assets/images/illustrations/time-to-contribute.svg';
import emptyBookmarkFiler from '@setup/react/assets/images/illustrations/empty-bookmark-filter.svg';
import emptyBookmarkFilerDark from '@setup/react/assets/images/illustrations/empty-bookmark-filter-dark.svg';
import emptyBookmarksList from '@setup/react/assets/images/illustrations/empty-bookmarks-list.svg';
import emptyBookmarksListDark from '@setup/react/assets/images/illustrations/empty-bookmarks-list-dark.svg';
import helpCenter from '@setup/react/assets/images/illustrations/help-center.svg';
import emptyWallet from '@setup/react/assets/images/illustrations/empty-wallet.svg';
import emptyWalletDark from '@setup/react/assets/images/illustrations/empty-wallet-dark.svg';
import diveIntoDetails from '@setup/react/assets/images/illustrations/diveIntoDetails.svg';
import manageYourLSK from '@setup/react/assets/images/illustrations/manageYourLSK.svg';
import verifyMessageError from '@setup/react/assets/images/illustrations/verify-message-error.svg';
import verifyMessageErrorDark from '@setup/react/assets/images/illustrations/verify-message-error-dark.svg';
import verifyMessageSuccess from '@setup/react/assets/images/illustrations/verify-message-success.svg';
import verifyMessageSuccessDark from '@setup/react/assets/images/illustrations/verify-message-success-dark.svg';
import registrationSuccess from '@setup/react/assets/images/illustrations/registration-success.svg';
import registrationSuccessDark from '@setup/react/assets/images/illustrations/registration-success-dark.svg';
import multisignaturePartialSuccess from '@setup/react/assets/images/illustrations/multisignature-partial-success.svg';
import multisignaturePartialSuccessDark from '@setup/react/assets/images/illustrations/multisignature-partial-success-dark.svg';
import registerMultisignatureSuccess from '@setup/react/assets/images/illustrations/multisignature-success.svg';
import registerMultisignatureSuccessDark from '@setup/react/assets/images/illustrations/multisignature-success-dark.svg';
import registerMultisignatureError from '@setup/react/assets/images/illustrations/multisignature-error.svg';
import registerMultisignatureErrorDark from '@setup/react/assets/images/illustrations/multisignature-error-dark.svg';
import reclaimTokensIntro from '@setup/react/assets/images/illustrations/reclaim-tokens-intro.svg';
import hwLedgerConfirm from '@setup/react/assets/images/illustrations/hw-ledger-confirm.svg';
import hwRejection from '@setup/react/assets/images/illustrations/hw-rejection-ledger-nano.svg';
import hwRejectionDark from '@setup/react/assets/images/illustrations/hw-rejection-ledger-nano-dark.svg';
import hwReconnection from '@setup/react/assets/images/illustrations/hardware-wallet-reconnect.svg';
import hwReconnectionDark from '@setup/react/assets/images/illustrations/hardware-wallet-reconnect-dark.svg';
import addApplicationSuccess from '@setup/react/assets/images/illustrations/add-application-success.svg';
import validatorRegistrationSuccess from '@setup/react/assets/images/illustrations/validator-registration-success.svg';
import validatorRegistrationError from '@setup/react/assets/images/illustrations/validator-registration-error.svg';
import applicationDetailsError from '@setup/react/assets/images/illustrations/application-details-error.svg';
import accountManagement from '@setup/react/assets/images/illustrations/account-management.svg';
import applicationManagement from '@setup/react/assets/images/illustrations/application-management.svg';
import proofOfStake from '@setup/react/assets/images/illustrations/proof-of-stake.svg';
import networkErrorIllustration from '@setup/react/assets/images/illustrations/networkError.svg';

import emptyEventsIllustration from '@setup/react/assets/images/illustrations/emptyStates/events-empty-illustration.svg';
import emptyExploreApplicationsIllustration from '@setup/react/assets/images/illustrations/emptyStates/explore-applications-illustration.svg';
import emptyConnectedPeersIllustration from '@setup/react/assets/images/illustrations/emptyStates/connected-peers-empty-illustration.svg';
import emptyNetworkStatisticsIllustration from '@setup/react/assets/images/illustrations/emptyStates/network-statistics-empty-illustration.svg';
import emptyStakersIllustration from '@setup/react/assets/images/illustrations/emptyStates/stakers-empty-illustration.svg';
import emptyStakesIllustration from '@setup/react/assets/images/illustrations/emptyStates/stakes-empty-illstration.svg';
import emptyTokensIllustration from '@setup/react/assets/images/illustrations/emptyStates/tokens-empty-illustration.svg';
import emptyTransactionsIllustration from '@setup/react/assets/images/illustrations/emptyStates/transactions-empty-illustration.svg';
import emptyValidatorsIllustration from '@setup/react/assets/images/illustrations/emptyStates/validators-empty-illustration.svg';
import emptyWalletConnectionsIllustration from '@setup/react/assets/images/illustrations/emptyStates/wallet-connections-illustration.svg';
import emptyStakingQueueIllustration from '@setup/react/assets/images/illustrations/emptyStates/staking-queue-empty-illustration.svg';

export const illustrations = {
  welcomeLiskValidators,
  yourVoiceMatters,
  getRewarded,
  expandYourKnowledge,
  ledgerNano,
  ledgerNanoDark,
  transactionSuccess,
  transactionError,
  stakingSuccess,
  stakingError,
  pageNotFound,
  errorBoundaryPage,
  hubReadyToGo,
  builtAroundCommunity,
  sendLSKTokens,
  timeToContribute,
  emptyBookmarkFiler,
  emptyBookmarksList,
  emptyWallet,
  helpCenter,
  diveIntoDetails,
  manageYourLSK,
  verifyMessageError,
  verifyMessageSuccess,
  registrationSuccess,
  registrationSuccessDark,
  emptyWalletDark,
  pageNotFoundDark,
  errorBoundaryPageDark,
  stakingSuccessDark,
  stakingErrorDark,
  transactionSuccessDark,
  transactionErrorDark,
  emptyBookmarksListDark,
  emptyBookmarkFilerDark,
  verifyMessageErrorDark,
  verifyMessageSuccessDark,
  registerMultisignatureSuccess,
  registerMultisignatureSuccessDark,
  registerMultisignatureError,
  registerMultisignatureErrorDark,
  reclaimTokensIntro,
  transactionPending,
  transactionPendingDark,
  multisignaturePartialSuccess,
  multisignaturePartialSuccessDark,
  hwLedgerConfirm,
  hwRejection,
  hwRejectionDark,
  hwReconnection,
  hwReconnectionDark,
  addApplicationSuccess,
  validatorRegistrationSuccess,
  validatorRegistrationError,
  applicationDetailsError,
  accountManagement,
  applicationManagement,
  proofOfStake,
  networkErrorIllustration,

  emptyEventsIllustration,
  emptyExploreApplicationsIllustration,
  emptyConnectedPeersIllustration,
  emptyNetworkStatisticsIllustration,
  emptyStakersIllustration,
  emptyStakesIllustration,
  emptyTokensIllustration,
  emptyTransactionsIllustration,
  emptyValidatorsIllustration,
  emptyWalletConnectionsIllustration,
  emptyStakingQueueIllustration,
};

const Illustration = ({ name, className, noTheme, ...props }) => {
  const theme = useTheme();
  const themed =
    theme === 'dark' && !noTheme && illustrations[`${name}Dark`] ? `${name}Dark` : name;
  return <img src={illustrations[themed]} alt={name} className={className} {...props} />;
};

Illustration.propTypes = {
  name: PropTypes.oneOf(Object.keys(illustrations)),
  className: PropTypes.string,
};

Illustration.defaultProps = {
  className: '',
};

export default Illustration;
