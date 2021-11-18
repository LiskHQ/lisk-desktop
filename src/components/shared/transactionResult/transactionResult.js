/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import Ordinary from './ordinary';
import Multisignature from './multisignature';

const TransactionResult = (props) => {
  const [txType, setTxType] = useState('pending');

  useEffect(() => {
    const isMultisig = !props.transactions.txSignatureError
      && (
        props.transactions.signedTransaction.signatures.length > 1
        || props.account.summary.isMultisignature
        || props.account.summary.publicKey !== props.transactions.signedTransaction.senderPublicKey.toString('hex')
      );
    if (isMultisig) {
      setTxType('isMultisig');
    } else {
      setTxType('ordinary');
    }
  }, []);
  /**
   * Broadcast the successfully signed tx by
   * 1. Ordinary accounts
   * 2. 2nd passphrase accounts
   */
  if (txType === 'ordinary') {
    return (<Ordinary {...props} />);
  }

  if (txType === 'isMultisig') {
    return (<Multisignature {...props} />);
  }
  return <div />;
};

export default TransactionResult;
