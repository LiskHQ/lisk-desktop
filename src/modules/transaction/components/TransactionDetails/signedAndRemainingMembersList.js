import React, { useMemo } from 'react';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { SignedAndRemainingMembers } from '@wallet/components/multisignatureMembers';
import { calculateRemainingAndSignedMembers } from '@wallet/utils/account';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './TransactionDetails.css';

const SignedAndRemainingMembersList = ({ t }) => {
  const { transaction, account } = React.useContext(TransactionDetailsContext);

  const isMultisignatureGroupRegistration = transaction.moduleAssetId
    === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;

  const keys = isMultisignatureGroupRegistration
    ? {
      optionalKeys: transaction.asset.optionalKeys,
      mandatoryKeys: transaction.asset.mandatoryKeys,
      numberOfSignatures: transaction.asset.numberOfSignatures,
    }
    : account.keys;

  const { signed, remaining } = useMemo(
    () =>
      calculateRemainingAndSignedMembers(
        keys,
        transaction.signatures,
        isMultisignatureGroupRegistration,
      ),
    [account],
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
