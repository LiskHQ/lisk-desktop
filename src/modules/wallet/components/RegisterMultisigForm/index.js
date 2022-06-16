import React from 'react';
import { useTranslation } from 'react-i18next';
import FormComp from './Form';

const Form = (props) => {
  const { t } = useTranslation();
  return <FormComp t={t} {...props} />;
};

export default Form;
