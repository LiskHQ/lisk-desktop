/* istanbul ignore file */
import React from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveTokenAccount } from '@store/selectors';
import { transactionBroadcasted } from '@actions';
import ResultComponent from './result';

const Result = (props) => {
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transactions);
  const account = useSelector(selectActiveTokenAccount);

  return (
    <ResultComponent
      {...props}
      transactions={transactions}
      account={account}
      transactionBroadcasted={params =>
        dispatch(transactionBroadcasted(params))}
    />
  );
};

export default withTranslation()(Result);
