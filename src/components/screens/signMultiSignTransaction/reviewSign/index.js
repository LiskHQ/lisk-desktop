import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '@utils/account';
import ReviewSignComp from './reviewSign';

const ReviewSign = (props) => {
  const { t } = useTranslation();
  const networkIdentifier = useSelector(state => state.network.networks.LSK.networkIdentifier);
  const account = useSelector(getActiveTokenAccount);

  return (
    <ReviewSignComp
      t={t}
      {...props}
      networkIdentifier={networkIdentifier}
      account={account}
    />
  );
};

export default ReviewSign;
