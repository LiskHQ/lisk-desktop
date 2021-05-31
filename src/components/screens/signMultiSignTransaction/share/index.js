import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ShareComp from './share';

const Share = (props) => {
  const { t } = useTranslation();
  const account = useSelector(state => state.account);
  const networkIdentifier = useSelector(state => state.network.networks.LSK.networkIdentifier);
  const dispatch = useDispatch();
  const createdTransaction = useSelector(state => state.transactions.transactionsCreated[0]);
  return (
    <ShareComp
      t={t}
      account={account}
      networkIdentifier={networkIdentifier}
      createdTransaction={createdTransaction}
      dispatch={dispatch}
      {...props}
    />
  );
};

export default Share;
