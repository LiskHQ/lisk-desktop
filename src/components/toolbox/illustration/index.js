import React from 'react';
import welcomeLiskDelegates from '../../../assets/images/illustrations/illustration-welcome-to-lisk-delegates-dark.svg';
import yourVoiceMatters from '../../../assets/images/illustrations/illustration-your-voice-matters-dark.svg';
import getRewarded from '../../../assets/images/illustrations/illustration-get-rewarded-dark.svg';
import expandYourKnowledge from '../../../assets/images/illustrations/illustration-expand-your-knowledge-dark.svg';
import ledgerNanoLight from '../../../assets/images/illustrations/illustration-ledger-nano-light.svg';
import trezorLight from '../../../assets/images/illustrations/illustration-trezor-confirm-light.svg';
import transactionSuccess from '../../../assets/images/illustrations/transaction_success.svg';
import transactionError from '../../../assets/images/illustrations/transaction_error.svg';
import pageNotFound from '../../../assets/images/illustrations/illustration-page-not-found.svg';
import errorBoundaryPage from '../../../assets/images/illustrations/illustration-error-boundary-page.svg';
import hubReadyToGo from '../../../assets/images/illustrations/hub-ready-togo.svg';
import builtAroundCommunity from '../../../assets/images/illustrations/built-around-community.svg';
import sendLSKTokens from '../../../assets/images/illustrations/send-lsk-tokens.svg';
import timeToContribute from '../../../assets/images/illustrations/time-to-contribute.svg';


const illustrations = {
  welcomeLiskDelegates,
  yourVoiceMatters,
  getRewarded,
  expandYourKnowledge,
  ledgerNanoLight,
  trezorLight,
  transactionSuccess,
  transactionError,
  pageNotFound,
  errorBoundaryPage,
  hubReadyToGo,
  builtAroundCommunity,
  sendLSKTokens,
  timeToContribute,
};

const Illustration = ({ name, className }) => (
  <img src={illustrations[name]} className={className} />
);
export default Illustration;
