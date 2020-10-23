import React from 'react';
import { useTranslation } from 'react-i18next';
import ShareComp from './share';

const Share = (props) => {
  const { t } = useTranslation();
  return <ShareComp t={t} {...props} />;
};

export default Share;