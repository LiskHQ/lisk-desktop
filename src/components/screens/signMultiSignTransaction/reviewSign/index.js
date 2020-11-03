import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ReviewSignComp from './reviewSign';

const ReviewSign = (props) => {
  const { t } = useTranslation();
  const networkIdentifier = useSelector(state => state.network.networks.LSK.networkIdentifier);
  const host = useSelector(state => state.account);

  return (
    <ReviewSignComp
      t={t}
      {...props}
      networkIdentifier={networkIdentifier}
      host={host}
    />
  );
};

export default ReviewSign;
