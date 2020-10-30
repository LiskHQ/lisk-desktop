import React from 'react';
import { useTranslation } from 'react-i18next';
import ReviewSignComp from './reviewSign';

const ReviewSign = (props) => {
  const { t } = useTranslation();
  return <ReviewSignComp t={t} {...props} />;
};

export default ReviewSign;
