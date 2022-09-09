import React, { useMemo } from 'react';
import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { SignedAndRemainingMembers } from '@wallet/components/multisignatureMembers';
import { calculateRemainingAndSignedMembers } from '@wallet/utils/account';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';

const SignedAndRemainingMembersList = ({ t }) => {
  const { transaction, wallet } = React.useContext(TransactionDetailsContext);

  const isMultisignatureGroupRegistration =
    transaction.moduleCommandID === MODULE_COMMANDS_NAME_ID_MAP.registerMultisignatureGroup;

  const keys = isMultisignatureGroupRegistration
    ? {
        optionalKeys: transaction.params.optionalKeys,
        mandatoryKeys: transaction.params.mandatoryKeys,
        numberOfSignatures: transaction.params.numberOfSignatures,
      }
    : wallet.keys;

  const { signed, remaining } = useMemo(
    () =>
      calculateRemainingAndSignedMembers(
        keys,
        transaction.signatures,
        isMultisignatureGroupRegistration
      ),
    [wallet]
  );

  const required = isMultisignatureGroupRegistration
    ? keys.optionalKeys.length + keys.mandatoryKeys.length
    : keys.numberOfSignatures;

  const needed = required - signed.length;

  return (
    <SignedAndRemainingMembers
      signed={signed}
      remaining={remaining}
      needed={needed}
      required={required}
      className={styles.signedAndRemainingMembersList}
      t={t}
    />
  );
};

export default SignedAndRemainingMembersList;
