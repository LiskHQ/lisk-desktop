import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ShareComp from './share';

const Share = (props) => {
  const { t } = useTranslation();
  const account = useSelector(state => state.account);
  const { txBroadcastError } = useSelector(state => state.transactions);
  const networkIdentifier = useSelector(state => state.network.networks.LSK.networkIdentifier);
  const dispatch = useDispatch();

  return (
    <ShareComp
      t={t}
      account={account}
      txBroadcastError={txBroadcastError}
      networkIdentifier={networkIdentifier}
      dispatch={dispatch}
      {...props}
    />
  );
};

export default Share;
