import React, { useMemo, useState } from 'react';

import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton } from '../../../toolbox/buttons';
import TransactionPriority from '../../../shared/transactionPriority';
import { tokenMap } from '../../../../constants/tokens';
import { toRawLsk } from '../../../../utils/lsk';
import useTransactionFeeCalculation from '../../send/form/useTransactionFeeCalculation';
import useTransactionPriority from '../../send/form/useTransactionPriority';
import Table from '../../../toolbox/table';
import ToggleIcon from '../toggleIcon';
import VoteStats from '../voteStats';

import VoteRow from './voteRow';
import EmptyState from './emptyState';
import header from './tableHeader';
import styles from './editor.css';

/**
 * Converts the votes object stored in Redux store
 * which looks like { delegateAddress: { confirmed, unconfirmed } }
 * into an array of objects that Lisk Element expects, looking like
 * [{ delegatesAddress, amount }]
 *
 * @param {Object} votes - votes object retrieved from the Redux store
 * @returns {Array} Array of votes as Lisk Element expects
 */
const normalizeVotesForTx = votes =>
  Object.keys(votes)
    .filter(address => votes[address].confirmed !== votes[address].unconfirmed)
    .map(delegateAddress => ({
      delegateAddress,
      amount: (votes[delegateAddress].unconfirmed - votes[delegateAddress].confirmed).toString(),
    }));

/**
 * Validates given votes against the following criteria:
 * - Number of votes must not exceed 10
 * - Added vote amounts + fee must not exceed account balance
 * @param {Object} votes - Votes object from Redux store
 * @param {Number} balance - Account balance in Beddows
 * @param {Number} fee - Tx fee in Beddows
 * @param {Function} t - i18n translation function
 * @returns {Object} The feedback object including error status and messages
 */
const validateVotes = (votes, balance, fee, t) => {
  const messages = [];

  const areVotesInValid = Object.values(votes).some(vote =>
    (vote.unconfirmed === '' || vote.unconfirmed === undefined));

  if (areVotesInValid) {
    messages.push(t('Please enter vote amounts for the delegates you wish to vote for'));
  }

  if (Object.keys(votes).length > 10) {
    messages.push(t('You can\'t vote for more than 10 delegates.'));
  }

  const addedVoteAmount = Object.values(votes)
    .filter(vote => vote.unconfirmed > vote.confirmed)
    .reduce((sum, vote) => { sum += (vote.unconfirmed - vote.confirmed); return sum; }, 0);

  if ((addedVoteAmount + toRawLsk(fee)) > balance) {
    messages.push(t('You don\'t have enough LSK in your account.'));
  }

  return { messages, error: !!messages.length };
};

/**
 * Determines the number of votes that have been
 * added, removed or edited.
 *
 * @param {Object} votes - votes object retrieved from the Redux store
 * @returns {Object} - stats object
 */
const getVoteStats = votes =>
  Object.keys(votes)
    .reduce((stats, address) => {
      const { confirmed, unconfirmed } = votes[address];
      if (!confirmed && unconfirmed) {
        // new vote
        stats.added[address] = { unconfirmed };
      } else if (confirmed && !unconfirmed) {
        // removed vote
        stats.removed[address] = { confirmed };
      } else if (confirmed !== unconfirmed) {
        // edited vote
        stats.edited[address] = { unconfirmed, confirmed };
      }
      return stats;
    }, { added: {}, edited: {}, removed: {} });

const token = tokenMap.LSK.key;
const txType = 'vote';

// eslint-disable-next-line max-statements
const Editor = ({
  t, votes, account, nextStep,
}) => {
  const [customFee, setCustomFee] = useState();
  const [
    selectedPriority, selectTransactionPriority,
    priorityOptions, prioritiesLoadError, loadingPriorities,
  ] = useTransactionPriority(token);

  const changedVotes = Object.keys(votes)
    .filter(address => votes[address].unconfirmed !== votes[address].confirmed)
    .map(address => ({ address, ...votes[address] }));

  const normalizedVotes = useMemo(() => normalizeVotesForTx(votes), [votes]);

  const { fee, minFee } = useTransactionFeeCalculation({
    selectedPriority,
    token,
    account,
    priorityOptions,
    txData: {
      txType,
      nonce: account.nonce,
      senderPublicKey: account.publicKey,
      votes: normalizedVotes,
    },
  });

  const { added, edited, removed } = useMemo(() => getVoteStats(votes), [votes]);
  const feedback = validateVotes(votes, account.balance, fee.value, t);

  const isCTADisabled = feedback.error || Object.keys(changedVotes).length === 0;

  const goToNextStep = () => {
    const feeValue = customFee ? customFee.value : fee.value;
    nextStep({
      added, edited, removed, fee: toRawLsk(feeValue), normalizedVotes,
    });
  };

  const showEmptyState = !changedVotes.length;

  return (
    <section className={styles.wrapper}>
      <Box>
        <ToggleIcon isNotHeader />
        <div className={styles.headerContainer}>
          <header>
            {t('Voting Queue')}
          </header>
          {!showEmptyState && (
            <VoteStats
              t={t}
              added={Object.keys(added).length}
              edited={Object.keys(edited).length}
              removed={Object.keys(removed).length}
            />
          )}
        </div>
        {showEmptyState
          ? (
            <EmptyState t={t} />
          )
          : (
            <>
              <BoxContent className={styles.contentContainer}>
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
              <TransactionPriority
                className={styles.txPriority}
                token={token}
                fee={fee}
                minFee={minFee.value}
                customFee={customFee ? customFee.value : undefined}
                txType={txType}
                setCustomFee={setCustomFee}
                priorityOptions={priorityOptions}
                selectedPriority={selectedPriority.selectedIndex}
                setSelectedPriority={selectTransactionPriority}
                loadError={prioritiesLoadError}
                isLoading={loadingPriorities}
              />
              {
                feedback.error && (
                  <div className={`${styles.feedback} feedback`}>
                    <span>{feedback.messages[0]}</span>
                  </div>
                )
              }
              <BoxFooter>
                <PrimaryButton
                  className="confirm"
                  size="l"
                  disabled={isCTADisabled}
                  onClick={goToNextStep}
                >
                  {t('Continue')}
                </PrimaryButton>
              </BoxFooter>
            </>
          )}
      </Box>
    </section>
  );
};

export default Editor;
