/* istanbul ignore file */
import React from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ResultComponent from './result';
import { transactionBroadcasted } from '../../../../actions/transactions';

const Result = (props) => {
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transactions);

  return (
    <ResultComponent
      {...props}
      transactions={transactions}
      transactionBroadcasted={params =>
        dispatch(transactionBroadcasted(params))
      }
    />
  );
};

export default withTranslation()(Result);
