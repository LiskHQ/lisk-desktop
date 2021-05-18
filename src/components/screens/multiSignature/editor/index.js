import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getActiveTokenAccount } from '@utils/account';
import EditorComp from './editor';

const Editor = (props) => {
  const { t } = useTranslation();
  const account = useSelector(getActiveTokenAccount);
  return <EditorComp t={t} account={account} {...props} />;
};

export default Editor;
