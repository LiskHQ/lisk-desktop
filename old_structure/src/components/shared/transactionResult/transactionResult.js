/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { txStatusTypes } from '@constants';
import Regular from './regular';
import Multisignature from './multisignature';

const TransactionResult = (props) => {
  const [txType, setTxType] = useState('pending');

  useEffect(() => {
    const isMultisig = !props.transactions.txSignatureError
      && props.status.code !== txStatusTypes.broadcastSuccess
      && (
        props.transactions.signedTransaction.signatures.length > 1
        || props.status.code === txStatusTypes.multisigSignaturePartialSuccess
        || props.account.summary.isMultisignature
        || props.account.summary.publicKey !== props.transactions.signedTransaction.senderPublicKey.toString('hex')
      );
    if (isMultisig) {
      setTxType('isMultisig');
    } else {
      setTxType('regular');
    }
  }, []);
  /**
   * Broadcast the successfully signed tx by
   * 1. Regular accounts
   * 2. 2nd passphrase accounts
   */
  if (txType === 'regular') {
    return (<Regular {...props} />);
  }

  if (txType === 'isMultisig') {
    return (<Multisignature {...props} />);
  }
  return <div />;
};

export default TransactionResult;
