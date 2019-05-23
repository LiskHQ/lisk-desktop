import React from 'react';
import ledgerNanoLight from '../../../assets/images/illustrations/illustration-ledger-nano-light.svg';
import trezorLight from '../../../assets/images/illustrations/illustration-trezor-confirm-light.svg';
import transactionSuccess from '../../../assets/images/illustrations/transaction_success.svg';
import transactionError from '../../../assets/images/illustrations/transaction_error.svg';

const illustrations = {
  ledgerNanoLight,
  trezorLight,
  transactionSuccess,
  transactionError,
};

const Illustration = ({ name, className }) => (
  <img src={illustrations[name]} className={className} />
);
export default Illustration;
