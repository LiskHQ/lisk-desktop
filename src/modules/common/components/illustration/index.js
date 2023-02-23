import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'src/theme/Theme';
import welcomeLiskValidators from '@setup/react/assets/images/illustrations/illustration-welcome-to-lisk-validators-dark.svg';
import yourVoiceMatters from '@setup/react/assets/images/illustrations/illustration-your-voice-matters-dark.svg';
import getRewarded from '@setup/react/assets/images/illustrations/illustration-get-rewarded-dark.svg';
import expandYourKnowledge from '@setup/react/assets/images/illustrations/illustration-expand-your-knowledge-dark.svg';
import ledgerNano from '@setup/react/assets/images/illustrations/illustration-ledger-nano-light.svg';
import ledgerNanoDark from '@setup/react/assets/images/illustrations/illustration-ledger-nano-dark.svg';
import trezor from '@setup/react/assets/images/illustrations/illustration-trezor-confirm-light.svg';
import trezorDark from '@setup/react/assets/images/illustrations/illustration-trezor-confirm-dark.svg';
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
import trezorHwRejection from '@setup/react/assets/images/illustrations/hw-rejection-trezor.svg';
import trezorHwRejectionDark from '@setup/react/assets/images/illustrations/hw-rejection-trezor-dark.svg';
import ledgerNanoHwRejection from '@setup/react/assets/images/illustrations/hw-rejection-ledger-nano.svg';
import ledgerNanoHwRejectionDark from '@setup/react/assets/images/illustrations/hw-rejection-ledger-nano-dark.svg';
import hwReconnection from '@setup/react/assets/images/illustrations/hardware-wallet-reconnect.svg';
import hwReconnectionDark from '@setup/react/assets/images/illustrations/hardware-wallet-reconnect-dark.svg';
import addApplicationSuccess from '@setup/react/assets/images/illustrations/add-application-success.svg';
import validatorRegistrationSuccess from '@setup/react/assets/images/illustrations/validator-registration-success.svg';
import validatorRegistrationError from '@setup/react/assets/images/illustrations/validator-registration-error.svg';

export const illustrations = {
  welcomeLiskValidators,
  yourVoiceMatters,
  getRewarded,
  expandYourKnowledge,
  ledgerNano,
  ledgerNanoDark,
  trezor,
  trezorDark,
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
  trezorHwRejection,
  trezorHwRejectionDark,
  ledgerNanoHwRejection,
  ledgerNanoHwRejectionDark,
  hwReconnection,
  hwReconnectionDark,
  addApplicationSuccess,
  validatorRegistrationSuccess,
  validatorRegistrationError,
};

const Illustration = ({ name, className, noTheme, ...props }) => {
  const theme = useTheme();
  const themed =
    theme === 'dark' && !noTheme && illustrations[`${name}Dark`] ? `${name}Dark` : name;
  return <img src={illustrations[themed]} className={className} {...props} />;
};

Illustration.propTypes = {
  name: PropTypes.oneOf(Object.keys(illustrations)),
  className: PropTypes.string,
};

Illustration.defaultProps = {
  className: '',
};

export default Illustration;
