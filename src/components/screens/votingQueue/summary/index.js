/* istanbul ignore file */
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { votesSubmitted } from '@actions';
import { getActiveTokenAccount } from '@utils/account';
import SummaryComponent from './summary';

const Summary = (props) => {
  const { t } = useTranslation();
  const transactions = useSelector(state => state.transactions);
  const account = useSelector(getActiveTokenAccount);

  return (
    <SummaryComponent
      {...props}
      t={t}
      account={account}
      transactions={transactions}
      votesSubmitted={votesSubmitted}
    />
  );
};

export default Summary;
