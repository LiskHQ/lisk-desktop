import React, { useMemo, useContext } from 'react';
import { SignedAndRemainingMembers } from '@wallet/components/multisignatureMembers';
import { calculateRemainingAndSignedMembers } from '@wallet/utils/account';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';

// eslint-disable-next-line max-statements
const SignedAndRemainingSignatureList = ({ t }) => {
  const { transaction, wallet } = useContext(TransactionDetailsContext);
  const keys = wallet.keys;
  const transactionKeys = {
    optionalKeys: transaction.params.optionalKeys,
    mandatoryKeys: transaction.params.mandatoryKeys,
    numberOfSignatures: transaction.params.numberOfSignatures,
  };

  const { remaining: remainingTxParamMembers } = useMemo(
    () => calculateRemainingAndSignedMembers(transactionKeys, transaction, true),
    [wallet]
  );

  const { signed, remaining } = useMemo(
    () => calculateRemainingAndSignedMembers(keys, transaction, false),
    [wallet]
  );

  const required = keys.numberOfSignatures;
  const needed = required - signed.length;

  if (
    (signed.length === 0 && remaining.length === 0 && required === 0) ||
    remainingTxParamMembers.length > 0
  ) {
    return null;
  }

  return (
    <SignedAndRemainingMembers
      signed={signed}
      remaining={remaining}
      needed={needed}
      required={required}
      className={styles.signedAndRemainingSignatureList}
      title="Signatures"
      t={t}
    />
  );
};

export default SignedAndRemainingSignatureList;
