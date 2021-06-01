import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '@utils/account';
import { withRouter } from 'react-router';
import ReviewSignComp from './reviewSign';

const ReviewSign = (props) => {
  const { t } = useTranslation();
  const networkIdentifier = useSelector(state => state.network.networks.LSK.networkIdentifier);
  const account = useSelector(getActiveTokenAccount);
  const dispatch = useDispatch();

  return (
    <ReviewSignComp
      t={t}
      {...props}
      networkIdentifier={networkIdentifier}
      account={account}
      dispatch={dispatch}
    />
  );
};

export default withRouter(ReviewSign);
