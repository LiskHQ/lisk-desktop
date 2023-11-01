/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { useCommandSchema } from '@network/hooks';
import RequestSignStatus from '@wallet/components/RequestSignStatus';
import RegularTxStatus from '../Regular';
import MultisignatureTxStatus from '../Multisignature';

// eslint-disable-next-line max-statements
const TxBroadcaster = (props) => {
  const [txType, setTxType] = useState('pending');
  const { moduleCommandSchemas } = useCommandSchema();
  useEffect(() => {
    const isMultisig =
      !props.transactions.txSignatureError &&
      !props.transactions.txBroadcastError &&
      props.status.code !== txStatusTypes.broadcastSuccess &&
      (props.transactions.signedTransaction?.signatures?.length > 1 ||
        props.status.code === txStatusTypes.multisigSignaturePartialSuccess ||
        props.status.code === txStatusTypes.multisigSignatureSuccess ||
        props.account.summary.isMultisignature ||
        props.account.summary.publicKey !==
          props.transactions.signedTransaction?.senderPublicKey?.toString('hex'));
    if (isMultisig) {
      setTxType('isMultisig');
    } else if (props.location.search?.includes('request')) {
      setTxType('requested');
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
    return <RequestSignStatus moduleCommandSchemas={moduleCommandSchemas} {...props} />;
  }

  if (txType === 'regular') {
    return <RegularTxStatus moduleCommandSchemas={moduleCommandSchemas} {...props} />;
  }

  if (txType === 'isMultisig') {
    return <MultisignatureTxStatus moduleCommandSchemas={moduleCommandSchemas} {...props} />;
  }
  return <div />;
};

export default TxBroadcaster;
