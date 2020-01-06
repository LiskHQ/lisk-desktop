import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../../utils/theme';
import welcomeLiskDelegates from '../../../assets/images/illustrations/illustration-welcome-to-lisk-delegates-dark.svg';
import yourVoiceMatters from '../../../assets/images/illustrations/illustration-your-voice-matters-dark.svg';
import getRewarded from '../../../assets/images/illustrations/illustration-get-rewarded-dark.svg';
import expandYourKnowledge from '../../../assets/images/illustrations/illustration-expand-your-knowledge-dark.svg';
import ledgerNano from '../../../assets/images/illustrations/illustration-ledger-nano-light.svg';
import ledgerNanoDark from '../../../assets/images/illustrations/illustration-ledger-nano-dark.svg';
import trezor from '../../../assets/images/illustrations/illustration-trezor-confirm-light.svg';
import trezorDark from '../../../assets/images/illustrations/illustration-trezor-confirm-dark.svg';
import transactionSuccess from '../../../assets/images/illustrations/transaction-success.svg';
import transactionSuccessDark from '../../../assets/images/illustrations/transaction-success-dark.svg';
import transactionError from '../../../assets/images/illustrations/transaction-error.svg';
import transactionErrorDark from '../../../assets/images/illustrations/transaction-error-dark.svg';
import votingSuccessDark from '../../../assets/images/illustrations/voting-submitted-dark.svg';
import votingSuccess from '../../../assets/images/illustrations/voting-submitted.svg';
import votingError from '../../../assets/images/illustrations/voting-failed.svg';
import votingErrorDark from '../../../assets/images/illustrations/voting-failed-dark.svg';
import secondPassphraseSuccess from '../../../assets/images/illustrations/2nd-passphrase-submitted.svg';
import secondPassphraseSuccessrDark from '../../../assets/images/illustrations/2nd-passphrase-submitted-dark.svg';
import secondPassphraseError from '../../../assets/images/illustrations/2nd-passphrase-failed.svg';
import secondPassphraseErrorDark from '../../../assets/images/illustrations/2nd-passphrase-failed-dark.svg';
import pageNotFound from '../../../assets/images/illustrations/illustration-page-not-found.svg';
import pageNotFoundDark from '../../../assets/images/illustrations/illustration-page-not-found-dark.svg';
import errorBoundaryPage from '../../../assets/images/illustrations/illustration-error-boundary-page.svg';
import errorBoundaryPageDark from '../../../assets/images/illustrations/illustration-error-boundary-page-dark.svg';
import hubReadyToGo from '../../../assets/images/illustrations/hub-ready-togo.svg';
import builtAroundCommunity from '../../../assets/images/illustrations/built-around-community.svg';
import sendLSKTokens from '../../../assets/images/illustrations/send-lsk-tokens.svg';
import timeToContribute from '../../../assets/images/illustrations/time-to-contribute.svg';
import emptyBookmarkFiler from '../../../assets/images/illustrations/empty-bookmark-filter.svg';
import emptyBookmarkFilerDark from '../../../assets/images/illustrations/empty-bookmark-filter-dark.svg';
import emptyBookmarksList from '../../../assets/images/illustrations/empty-bookmarks-list.svg';
import emptyBookmarksListDark from '../../../assets/images/illustrations/empty-bookmarks-list-dark.svg';
import helpCenter from '../../../assets/images/illustrations/help-center.svg';
import emptyWallet from '../../../assets/images/illustrations/empty-wallet.svg';
import emptyWalletDark from '../../../assets/images/illustrations/empty-wallet-dark.svg';
import diveIntoDetails from '../../../assets/images/illustrations/diveIntoDetails.svg';
import manageYourLSK from '../../../assets/images/illustrations/manageYourLSK.svg';
import verifyMessageError from '../../../assets/images/illustrations/verify-message-error.svg';
import verifyMessageErrorDark from '../../../assets/images/illustrations/verify-message-error-dark.svg';
import verifyMessageSuccess from '../../../assets/images/illustrations/verify-message-success.svg';
import verifyMessageSuccessDark from '../../../assets/images/illustrations/verify-message-success-dark.svg';
import registrationSuccess from '../../../assets/images/illustrations/registration-success.svg';

export const illustrations = {
  welcomeLiskDelegates,
  yourVoiceMatters,
  getRewarded,
  expandYourKnowledge,
  ledgerNano,
  ledgerNanoDark,
  trezor,
  trezorDark,
  transactionSuccess,
  transactionError,
  votingSuccess,
  votingError,
  secondPassphraseSuccess,
  secondPassphraseError,
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
  emptyWalletDark,
  pageNotFoundDark,
  errorBoundaryPageDark,
  votingSuccessDark,
  votingErrorDark,
  secondPassphraseSuccessrDark,
  secondPassphraseErrorDark,
  transactionSuccessDark,
  transactionErrorDark,
  emptyBookmarksListDark,
  emptyBookmarkFilerDark,
  verifyMessageErrorDark,
  verifyMessageSuccessDark,
};

const Illustration = ({ name, className, noTheme }) => {
  const theme = useTheme();
  const themed = theme === 'dark' && !noTheme && illustrations[`${name}Dark`] ? `${name}Dark` : name;
  return <img src={illustrations[themed]} className={className} />;
};

Illustration.propTypes = {
  name: PropTypes.oneOf(Object.keys(illustrations)),
  className: PropTypes.string,
};

Illustration.defaultProps = {
  className: '',
};

export default Illustration;
