import React from 'react';
import MultiSignatureReview from '@transaction/detail/info/multiSignatureReview';

const RegisterMultisignatureGroup = ({
  t, members, fee, numberOfSignatures,
}) => (
  <MultiSignatureReview t={t} members={members} fee={fee} numberOfSignatures={numberOfSignatures} />
);

export default RegisterMultisignatureGroup;
