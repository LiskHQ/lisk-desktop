import React, { useMemo, useContext } from 'react';
import { SignedAndRemainingMembers } from '@wallet/components/multisignatureMembers';
import { calculateRemainingAndSignedMembers } from '@wallet/utils/account';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';

const SignedAndRemainingSignatureList = ({ t }) => {
  const { transaction, wallet } = useContext(TransactionDetailsContext);
  const keys = wallet.keys;

  const { signed, remaining } = useMemo(
    () => calculateRemainingAndSignedMembers(keys, transaction, false),
    [wallet]
  );

  const required = keys.numberOfSignatures;
  const needed = required - signed.length;

  console.log('>>>>>', signed, remaining, needed, required);

  return (
    <SignedAndRemainingMembers
      signed={signed}
      remaining={remaining}
      needed={needed}
      required={required}
      className={styles.signedAndRemainingSignatureList}
      t={t}
    />
  );
};

export default SignedAndRemainingSignatureList;
