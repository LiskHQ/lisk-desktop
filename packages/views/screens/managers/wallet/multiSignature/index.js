import React from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import MultiSignatureComponent from './multiSignature';
import { multisignGroups, transactionsData } from './mockData';

const MultiSignature = (props) => {
  const account = useSelector(state => state.wallet);
  const activeToken = useSelector(state => state.settings.token.active);

  return (
    <MultiSignatureComponent
      host={account.info[activeToken].address}
      {...props}
      multisignGroups={multisignGroups}
      transactions={transactionsData}
    />
  );
};

export default withTranslation()(MultiSignature);
