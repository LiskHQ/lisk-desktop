import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ImportDataComp from './importData';

const ImportData = (props) => {
  const { t } = useTranslation();
  const network = useSelector(state => state.network);
  return <ImportDataComp network={network} t={t} {...props} />;
};

export default ImportData;
