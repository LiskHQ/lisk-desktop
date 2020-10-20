import React from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import MultiSignatureComponent from './multiSignature';

const MultiSignature = (props) => {
  const account = useSelector(state => state.account);
  const activeToken = useSelector(state => state.settings.token.active);

  return (
    <MultiSignatureComponent host={account.info[activeToken].address} {...props} />
  );
};

export default withTranslation()(MultiSignature);
