/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import RegularTxStatus from '../Regular';
import MultisignatureTxStatus from '../Multisignature';
import RequestedTxStatus from '../RequestedTxStatus';

const TxBroadcaster = (props) => {
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
    if (props.location.search?.includes('request')) {
      setTxType('requested');
    } else if (isMultisig) {
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
   if (txType === 'requested') {
    return (<RequestedTxStatus {...props} />);
  }

  if (txType === 'regular') {
    return (<RegularTxStatus {...props} />);
  }

  if (txType === 'isMultisig') {
    return (<MultisignatureTxStatus {...props} />);
  }
  return <div />;
};

export default TxBroadcaster;
