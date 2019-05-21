import React from 'react';
import TransactionSummary from '../transactionSummary';
import {
  getVoteList,
  getUnvoteList,
} from '../../utils/voting';
import routes from '../../constants/routes';

const VotingSummary = ({ t, votes, history }) => {
  const voteList = getVoteList(votes);
  const unvoteList = getUnvoteList(votes);
  return (
    <TransactionSummary
      confirmButton={{
        label: t('Confirm voting'),
        onClick: () => {},
      }}
      cancelButton={{
        label: t('Edit voting'),
        onClick: () => {
          history.push(routes.delegatesV2.path);
        },
      }}
      title={t('Voting summary')} >
      <section>
        <label>{t('Votes after confirmation')}</label>
        <label> 7/101 </label>
      </section>
      <section>
        <label>{t('Transaction fee')}</label>
        <label> 1 LSK </label>
      </section>
      {voteList.length > 0 ?
        <section>
          <label>{t('Added votes')} ({voteList.length})</label>
          <label> TODO </label>
        </section> :
        null }
      {unvoteList.length > 0 ?
        <section>
          <label>{t('Removed votes')} ({unvoteList.length})</label>
          <label> TODO </label>
        </section> :
        null }
    </TransactionSummary>
  );
};

export default VotingSummary;
