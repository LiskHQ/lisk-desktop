import React, { useMemo, useState } from 'react';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { MIN_ACCOUNT_BALANCE } from '@transaction/configuration/transactions';
import { toRawLsk } from '@token/fungible/utils/lsk';
import { normalizeVotesForTx } from '@transaction/utils';
import BoxContent from '@theme/box/content';
import TxComposer from '@transaction/components/TxComposer';
import Table from '@theme/table';
import ToggleIcon from '../toggleIcon';
import { VOTE_LIMIT } from '../../consts';
import VoteRow from './VoteRow';
import EmptyState from './EmptyState';
import header from './tableHeader';
import styles from './voteForm.css';

/**
 * Determines the number of votes that have been
 * added, removed or edited.
 *
 * @param {Object} votes - votes object retrieved from the Redux store
 * @returns {Object} - stats object
 */
const getVoteStats = (votes, account) => {
  const votesStats = Object.keys(votes)
    .reduce(
      // eslint-disable-next-line max-statements
      (stats, address) => {
        const { confirmed, unconfirmed, username } = votes[address];

        if (confirmed === 0 && unconfirmed === 0) {
          return stats;
        }

        if (!confirmed && unconfirmed) {
          // new vote
          stats.added[address] = { unconfirmed, username };
        } else if (confirmed && !unconfirmed) {
          // removed vote
          stats.removed[address] = { confirmed, username };
          if (address === account.summary.address) {
            stats.selfUnvote = { confirmed, username };
          }
        } else if (confirmed !== unconfirmed) {
          // edited vote
          stats.edited[address] = { unconfirmed, confirmed, username };
        } else {
          // untouched
          stats.untouched[address] = { unconfirmed, confirmed, username };
        }
        return stats;
      },
      {
        added: {},
        edited: {},
        removed: {},
        untouched: {},
        selfUnvote: {},
      },
    );

  const numOfAddededVotes = Object.keys(votesStats.added).length;
  const numOfEditedVotes = Object.keys(votesStats.edited).length;
  const numOfUntouchedVotes = Object.keys(votesStats.untouched).length;
  const numOfRemovedVotes = Object.keys(votesStats.removed).length;

  const resultingNumOfVotes = numOfAddededVotes + numOfEditedVotes + numOfUntouchedVotes;
  const availableVotes = VOTE_LIMIT - (numOfEditedVotes + numOfUntouchedVotes + numOfRemovedVotes);

  return {
    ...votesStats,
    resultingNumOfVotes,
    availableVotes,
  };
};

/**
 * Validates given votes against the following criteria:
 * - Number of votes must not exceed VOTE_LIMIT
 * - Added vote amounts + fee must not exceed account balance
 * @param {Object} votes - Votes object from Redux store
 * @param {Number} balance - Account balance in Beddows
 * @param {Number} fee - Tx fee in Beddows
 * @param {Number} resultingNumOfVotes - Number of used voted that will result after submitting tx
 * @param {Function} t - i18n translation function
 * @returns {Object} The feedback object including error Status and messages
 */
// eslint-disable-next-line max-statements
const validateVotes = (votes, balance, fee, resultingNumOfVotes, t) => {
  const messages = [];
  const areVotesInValid = Object.values(votes).some(
    (vote) => vote.unconfirmed === '' || vote.unconfirmed === undefined,
  );

  if (areVotesInValid) {
    messages.push(
      t('Please enter vote amounts for the delegates you wish to vote for'),
    );
  }

  if (resultingNumOfVotes > VOTE_LIMIT) {
    messages.push(
      t(
        `These votes in addition to your current votes will add up to ${resultingNumOfVotes}, exceeding the account limit of ${VOTE_LIMIT}.`,
      ),
    );
  }

  const addedVoteAmount = Object.values(votes)
    .filter((vote) => vote.unconfirmed > vote.confirmed)
    .reduce((sum, vote) => {
      sum += vote.unconfirmed - vote.confirmed;
      return sum;
    }, 0);

  if (addedVoteAmount + toRawLsk(fee) > balance) {
    messages.push(t("You don't have enough LSK in your account."));
  }

  if (
    balance - addedVoteAmount < MIN_ACCOUNT_BALANCE
    && balance - addedVoteAmount
  ) {
    messages.push(
      'The vote amounts are too high. You should keep 0.05 LSK available in your account.',
    );
  }

  return { messages, error: !!messages.length };
};

const VoteForm = ({
  t,
  votes,
  account,
  isVotingTxPending,
  nextStep,
}) => {
  const [fee, setFee] = useState(0);
  const changedVotes = Object.keys(votes)
    .filter(
      (address) => votes[address].unconfirmed !== votes[address].confirmed,
    )
    .map((address) => ({ address, ...votes[address] }));

  const normalizedVotes = useMemo(() => normalizeVotesForTx(votes), [votes]);
  const {
    added,
    edited,
    removed,
    selfUnvote,
    availableVotes,
    resultingNumOfVotes,
  } = useMemo(() => getVoteStats(votes, account), [votes, account]);

  const feedback = validateVotes(
    votes,
    Number(account.token?.balance),
    fee,
    resultingNumOfVotes,
    t,
  );

  const onConfirm = (rawTx) => {
    nextStep({
      rawTx,
      added,
      edited,
      removed,
      selfUnvote,
    });
  };

  const onComposed = (rawTx) => {
    setFee(rawTx.fee);
  };

  const showEmptyState = !changedVotes.length || isVotingTxPending;
  const transaction = {
    moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
    isValid: !feedback.error && Object.keys(changedVotes).length > 0 && !isVotingTxPending,
    asset: {
      votes: normalizedVotes,
    },
  };

  return (
    <section className={styles.wrapper}>
      <TxComposer
        onComposed={onComposed}
        onConfirm={onConfirm}
        transaction={transaction}
      >
        <>
          <ToggleIcon isNotHeader className={styles.toggle} />
          {showEmptyState ? (
            <EmptyState t={t} />
          ) : (
            <>
              <BoxContent className={styles.container}>
                <header className={styles.headerContainer}>
                  <span className={styles.title}>{t('Voting queue')}</span>
                  <div className={styles.votesAvailableCounter}>
                    <span className="available-votes-num">{`${availableVotes}/`}</span>
                    <span>
                      {t('{{VOTE_LIMIT}} votes available for your account', {
                        VOTE_LIMIT,
                      })}
                    </span>
                  </div>
                </header>
                <div className={styles.contentScrollable}>
                  <Table
                    data={changedVotes}
                    header={header(t)}
                    row={VoteRow}
                    iterationKey="address"
                    canLoadMore={false}
                  />
                </div>
              </BoxContent>
              {feedback.error && (
                <div className={`${styles.feedback} feedback`}>
                  <span>{feedback.messages[0]}</span>
                </div>
              )}
            </>
          )}
        </>
      </TxComposer>
    </section>
  );
};

export default VoteForm;
