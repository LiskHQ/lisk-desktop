/* istanbul ignore file */
import React from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { transactionBroadcasted } from 'src/redux/actions';
import StatusComponent from './status';

const Status = (props) => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions);
  const account = useSelector(selectActiveTokenAccount);

  return (
    <StatusComponent
      {...props}
      transactions={transactions}
      account={account}
      transactionBroadcasted={(params) => dispatch(transactionBroadcasted(params))}
    />
  );
};

export default withTranslation()(Status);
