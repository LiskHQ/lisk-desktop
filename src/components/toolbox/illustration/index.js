import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import welcomeLiskDelegates from '../../../assets/images/illustrations/illustration-welcome-to-lisk-delegates-dark.svg';
import yourVoiceMatters from '../../../assets/images/illustrations/illustration-your-voice-matters-dark.svg';
import getRewarded from '../../../assets/images/illustrations/illustration-get-rewarded-dark.svg';
import expandYourKnowledge from '../../../assets/images/illustrations/illustration-expand-your-knowledge-dark.svg';
import ledgerNanoLight from '../../../assets/images/illustrations/illustration-ledger-nano-light.svg';
import trezorLight from '../../../assets/images/illustrations/illustration-trezor-confirm-light.svg';
import transactionSuccess from '../../../assets/images/illustrations/transaction_success.svg';
import transactionError from '../../../assets/images/illustrations/transaction_error.svg';
import votingSuccess from '../../../assets/images/illustrations/voting-submitted.svg';
import votingError from '../../../assets/images/illustrations/voting-failed.svg';
import secondPassphraseSuccess from '../../../assets/images/illustrations/2nd-passphrase-submitted.svg';
import secondPassphraseError from '../../../assets/images/illustrations/2nd-passphrase-failed.svg';
import pageNotFound from '../../../assets/images/illustrations/illustration-page-not-found.svg';
import pageNotFoundDark from '../../../assets/images/illustrations/illustration-page-not-found-dark.svg';
import errorBoundaryPage from '../../../assets/images/illustrations/illustration-error-boundary-page.svg';
import errorBoundaryPageDark from '../../../assets/images/illustrations/illustration-error-boundary-page-dark.svg';
import hubReadyToGo from '../../../assets/images/illustrations/hub-ready-togo.svg';
import builtAroundCommunity from '../../../assets/images/illustrations/built-around-community.svg';
import sendLSKTokens from '../../../assets/images/illustrations/send-lsk-tokens.svg';
import timeToContribute from '../../../assets/images/illustrations/time-to-contribute.svg';
import emptyBookmarkFiler from '../../../assets/images/illustrations/empty-bookmark-filter.svg';
import emptyBookmarksList from '../../../assets/images/illustrations/empty-bookmarks-list.svg';
import helpCenter from '../../../assets/images/illustrations/help-center.svg';
import emptyWallet from '../../../assets/images/illustrations/empty-wallet.svg';
import emptyWalletDark from '../../../assets/images/illustrations/empty-wallet-dark.svg';
import diveIntoDetails from '../../../assets/images/illustrations/diveIntoDetails.svg';
import manageYourLSK from '../../../assets/images/illustrations/manageYourLSK.svg';
import verifyMessageError from '../../../assets/images/illustrations/verify-message-error.svg';
import verifyMessageSuccess from '../../../assets/images/illustrations/verify-message-success.svg';
import registrationSuccess from '../../../assets/images/illustrations/registration-success.svg';

export const illustrations = {
  welcomeLiskDelegates,
  yourVoiceMatters,
  getRewarded,
  expandYourKnowledge,
  ledgerNanoLight,
  trezorLight,
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
};

const Illustration = ({ name, className, noTheme }) => {
  const darkMode = useSelector(state => state.settings.DarkMode);
  const themed = darkMode && !noTheme && illustrations[`${name}Dark`] ? `${name}Dark` : name;
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
