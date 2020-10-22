import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import MultiSignatureComponent from './multiSignature';
import { multisignGroups, transactionsData } from './mockData';

const MultiSignature = (props) => {
  const [selectedGroupId, setSelectedGroupId] = useState(1);
  const account = useSelector(state => state.account);
  const activeToken = useSelector(state => state.settings.token.active);

  return (
    <MultiSignatureComponent
      host={account.info[activeToken].address}
      {...props}
      selectedGroupId={selectedGroupId}
      setSelectedGroupId={setSelectedGroupId}
      multisignGroups={multisignGroups}
      transactions={transactionsData[selectedGroupId]}
    />
  );
};

export default withTranslation()(MultiSignature);
