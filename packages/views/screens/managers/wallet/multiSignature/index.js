import React from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import MultiSignatureComponent from './multiSignature';
import { multisignGroups, transactionsData } from './mockData';

const MultiSignature = (props) => {
  const account = useSelector(selectActiveTokenAccount);

  return (
    <MultiSignatureComponent
      host={account.summary.address}
      {...props}
      multisignGroups={multisignGroups}
      transactions={transactionsData}
    />
  );
};

export default withTranslation()(MultiSignature);
