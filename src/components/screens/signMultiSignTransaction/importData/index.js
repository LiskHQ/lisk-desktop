import React from 'react';
import { useTranslation } from 'react-i18next';
import ImportDataComp from './importData';

const ImportData = (props) => {
  const { t } = useTranslation();
  return <ImportDataComp t={t} {...props} />;
};

export default ImportData;
