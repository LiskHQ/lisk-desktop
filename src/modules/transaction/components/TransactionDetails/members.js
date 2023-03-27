import React, { useMemo } from 'react';
import MultiSignatureMembers from '@wallet/components/multisignatureMembers';
import { extractAddressFromPublicKey } from '@wallet/utils/account';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';

const Members = ({ t }) => {
  const {
    transaction: { params },
  } = React.useContext(TransactionDetailsContext);

  const { optionalKeys, mandatoryKeys } = params;

  const members = useMemo(
    () =>
      optionalKeys
        .map((publicKey) => ({
          address: extractAddressFromPublicKey(publicKey),
          publicKey,
          mandatory: false,
        }))
        .concat(
          mandatoryKeys.map((publicKey) => ({
            address: extractAddressFromPublicKey(publicKey),
            publicKey,
            mandatory: true,
          }))
        ),
    [params]
  );

  return <MultiSignatureMembers t={t} members={members} className={styles.multiSignatureMembers} />;
};

export default Members;
