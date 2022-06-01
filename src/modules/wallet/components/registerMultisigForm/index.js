import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveTokenAccount } from '@common/store';
import FormComp from './form';

const Form = (props) => {
  const { t } = useTranslation();
  const account = useSelector(selectActiveTokenAccount);
  const network = useSelector(state => state.network);
  return <FormComp t={t} account={account} network={network} {...props} />;
};

export default Form;
