import React from 'react';
import TransactionSummary from '../../../shared/transactionSummary';
import votingConst from '../../../../constants/voting';
import {
  getTotalVotesCount,
  getVoteList,
  getUnvoteList,
  getTotalActions,
} from '../../../../utils/voting';
import routes from '../../../../constants/routes';
import VoteUrlProcessor from './voteUrlProcessor';
import VoteList from './voteList';

const VotingSummary = ({
  t, votes, history, account, nextStep, votePlaced,
}) => {
  const {
    maxCountOfVotes,
    fee,
  } = votingConst;
  const voteList = getVoteList(votes);
  const unvoteList = getUnvoteList(votes);
  const totalActions = getTotalActions(votes);
  return (
    <TransactionSummary
      t={t}
      account={account}
      confirmButton={{
        label: t('Confirm voting'),
        disabled: totalActions === 0,
        onClick: ({ secondPassphrase }) => {
          votePlaced({
            account,
            votes,
            passphrase: account.passphrase,
            secondPassphrase,
            callback: ({ success, error }) => {
              nextStep({
                success,
                ...(success ? {
                  title: t('Voting submitted'),
                  illustration: 'votingSuccess',
                  message: t('You’ll see it in Delegates and it will be confirmed in a matter of minutes.'),
                  primaryButon: {
                    title: t('Back to Delegates'),
                    className: 'back-to-delegates-button',
                    onClick: () => {
                      history.push(routes.voting.path);
                    },
                  },
                } : {
                  title: t('Voting failed'),
                  illustration: 'votingError',
                  message: (error && error.message) || t('Oops, looks like something went wrong. Please try again.'),
                  primaryButon: {
                    title: t('Back to Voting Table'),
                    onClick: () => {
                      history.push(routes.voting.path);
                    },
                  },
                  error,
                }),
              });
            },
          });
        },
      }}
      cancelButton={{
        label: t('Edit voting'),
        onClick: () => {
          history.push(routes.voting.path);
        },
      }}
      fee={fee * totalActions}
      title={t('Voting summary')}
    >
      <VoteUrlProcessor
        account={account}
        votes={votes}
      />
      <VoteList
        title={t('Added votes')}
        className="added-votes"
        list={voteList}
        votes={votes}
      />
      <VoteList
        title={t('Removed votes')}
        className="removed-votes"
        list={unvoteList}
        votes={votes}
      />
      <section>
        <label>{t('Votes after confirmation')}</label>
        <label>
          {`${getTotalVotesCount(votes)}/${maxCountOfVotes}`}
        </label>
      </section>
    </TransactionSummary>
  );
};

export default VotingSummary;
