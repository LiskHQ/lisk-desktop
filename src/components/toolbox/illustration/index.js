import React from 'react';
import PropTypes from 'prop-types';
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
import errorBoundaryPage from '../../../assets/images/illustrations/illustration-error-boundary-page.svg';
import hubReadyToGo from '../../../assets/images/illustrations/hub-ready-togo.svg';
import builtAroundCommunity from '../../../assets/images/illustrations/built-around-community.svg';
import sendLSKTokens from '../../../assets/images/illustrations/send-lsk-tokens.svg';
import timeToContribute from '../../../assets/images/illustrations/time-to-contribute.svg';
import emptyBookmarkFiler from '../../../assets/images/illustrations/empty-bookmark-filter.svg';
import emptyBookmarksList from '../../../assets/images/illustrations/empty-bookmarks-list.svg';
import helpCenter from '../../../assets/images/help/Illustration.svg';
import emptyWallet from '../../../assets/images/illustrations/empty-wallet.svg';
import diveIntoDetails from '../../../assets/images/illustrations/diveIntoDetails.svg';
import manageYourLSK from '../../../assets/images/illustrations/manageYourLSK.svg';


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
};

const Illustration = ({ name, className }) => (
  <img src={illustrations[name]} className={className} />
);

Illustration.propTypes = {
  name: PropTypes.oneOf(Object.keys(illustrations)),
  className: PropTypes.string,
};

Illustration.defaultProps = {
  className: '',
};

export default Illustration;
