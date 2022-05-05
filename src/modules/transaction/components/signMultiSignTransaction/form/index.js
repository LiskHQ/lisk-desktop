import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import FormComp from './form';

const Form = (props) => {
  const { t } = useTranslation();
  const network = useSelector(state => state.network);
  return <FormComp network={network} t={t} {...props} />;
};

export default Form;
