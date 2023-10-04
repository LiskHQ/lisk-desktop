import React, { useMemo, useContext } from 'react';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { SignedAndRemainingMembers } from '@wallet/components/multisignatureMembers';
import { calculateRemainingAndSignedMembers } from '@wallet/utils/account';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';
import { joinModuleAndCommand } from '../../utils';

const TransactionSignedAndRemainingMembersList = ({ t }) => {
  const { transaction, wallet } = useContext(TransactionDetailsContext);

  const moduleCommand = joinModuleAndCommand(transaction);
  const isMultisignatureRegistration =
    moduleCommand === MODULE_COMMANDS_NAME_MAP.registerMultisignature;

  const keys = isMultisignatureRegistration
    ? {
        optionalKeys: transaction.params.optionalKeys,
        mandatoryKeys: transaction.params.mandatoryKeys,
        numberOfSignatures: transaction.params.numberOfSignatures,
      }
    : wallet.keys;

  const { signed, remaining } = useMemo(
    () => calculateRemainingAndSignedMembers(keys, transaction, isMultisignatureRegistration),
    [wallet]
  );

  const required = keys.numberOfSignatures;

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

export default TransactionSignedAndRemainingMembersList;
