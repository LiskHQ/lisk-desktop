/* istanbul ignore file */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { votesSubmitted } from 'src/redux/actions';
import { useCommandSchema } from '@network/hooks';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import SummaryComponent from './VoteSummary';

const Summary = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transactions);
  const account = useSelector(selectActiveTokenAccount);
  const { moduleCommandSchemas } = useCommandSchema();

  return (
    <SummaryComponent
      {...props}
      t={t}
      account={account}
      transactions={transactions}
      votesSubmitted={(...params) => {
        dispatch(votesSubmitted(...params, moduleCommandSchemas, account));
      }}
    />
  );
};

export default Summary;
