import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getActiveTokenAccount } from '@wallet/utilities/account';
import FormComp from './form';

const Form = (props) => {
  const { t } = useTranslation();
  const account = useSelector(getActiveTokenAccount);
  const network = useSelector(state => state.network);
  return <FormComp t={t} account={account} network={network} {...props} />;
};

export default Form;
