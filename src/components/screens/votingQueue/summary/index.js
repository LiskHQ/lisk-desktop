/* istanbul ignore file */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { votesSubmitted, transactionDoubleSigned } from '@actions';
import { getActiveTokenAccount } from '@utils/account';
import SummaryComponent from './summary';

const Summary = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transactions);
  const account = useSelector(getActiveTokenAccount);

  return (
    <SummaryComponent
      {...props}
      t={t}
      account={account}
      transactions={transactions}
      transactionDoubleSigned={(params) => {
        dispatch(transactionDoubleSigned(params));
      }}
      votesSubmitted={(params) => {
        dispatch(votesSubmitted(params));
      }}
    />
  );
};

export default Summary;
