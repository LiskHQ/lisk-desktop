import React from 'react';
import { extractAddressFromPublicKey } from '@wallet/utils/account';
import MultiSignatureReview from '../MultiSignatureReview';

const RegisterMultisignatureGroup = ({ t, transaction }) => {
  const mandatory = transaction.params.mandatoryKeys.map((item) => ({
    address: extractAddressFromPublicKey(item),
    publicKey: item,
    isMandatory: true,
  }));
  const optional = transaction.params.optionalKeys.map((item) => ({
    address: extractAddressFromPublicKey(item),
    publicKey: item,
    isMandatory: false,
  }));
  return (
    <MultiSignatureReview
      t={t}
      fee={transaction.fee}
      members={[...mandatory, ...optional]}
      numberOfSignatures={transaction.params.numberOfSignatures}
    />
  );
};

export default RegisterMultisignatureGroup;
