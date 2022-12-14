/* istanbul ignore file */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { votesSubmitted } from 'src/redux/actions';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import StakeSummary from './StakeSummary';

const Summary = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions);
  const account = useSelector(selectActiveTokenAccount);

  return (
    <StakeSummary
      {...props}
      t={t}
      account={account}
      transactions={transactions}
      votesSubmitted={(...params) => {
        dispatch(votesSubmitted(...params));
      }}
    />
  );
};

export default Summary;
