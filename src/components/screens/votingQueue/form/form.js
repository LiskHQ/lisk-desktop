import React, { useMemo, useState } from 'react';
import { tokenMap, MODULE_ASSETS_NAME_ID_MAP, MIN_ACCOUNT_BALANCE } from '@constants';
import { toRawLsk } from '@utils/lsk';
import TransactionPriority, {
  useTransactionFeeCalculation,
  useTransactionPriority,
  normalizeVotesForTx,
} from '@shared/transactionPriority';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import { PrimaryButton } from '@toolbox/buttons';

import Table from '@toolbox/table';
import ToggleIcon from '../toggleIcon';
import VoteStats from '../voteStats';

import VoteRow from './voteRow';
import EmptyState from './emptyState';
import header from './tableHeader';
import styles from './form.css';

const VOTE_LIMIT = 10;

/**
 * Determines the number of votes that have been
 * added, removed or edited.
 *
 * @param {Object} votes - votes object retrieved from the Redux store
 * @returns {Object} - stats object
 */
const getVoteStats = (votes, account) =>
  Object.keys(votes)
    .reduce((stats, address) => {
      const { confirmed, unconfirmed, username } = votes[address];

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
    }, {
      added: {}, edited: {}, removed: {}, untouched: {}, selfUnvote: {},
    });

const getRemainingAndResultingNumOfVotes = (votes, account) => {
  const votesStats = getVoteStats(votes, account);
  const resultingNumOfVotes = Object.keys(votesStats.added).length
    + Object.keys(votesStats.edited).length
    + Object.keys(votesStats.untouched).length
    - Object.keys(votesStats.removed).length;
  const remainingVotes = VOTE_LIMIT
    - (Object.keys(votesStats.edited).length + Object.keys(votesStats.untouched).length);

  return {
    resultingNumOfVotes,
    remainingVotes,
  };
};

/**
 * Validates given votes against the following criteria:
 * - Number of votes must not exceed VOTE_LIMIT
 * - Added vote amounts + fee must not exceed account balance
 * @param {Object} votes - Votes object from Redux store
 * @param {Number} balance - Account balance in Beddows
 * @param {Number} fee - Tx fee in Beddows
 * @param {Function} t - i18n translation function
 * @returns {Object} The feedback object including error status and messages
 */
// eslint-disable-next-line max-statements
const validateVotes = (votes, balance, fee, account, t) => {
  const messages = [];
  const areVotesInValid = Object.values(votes).some(vote =>
    (vote.unconfirmed === '' || vote.unconfirmed === undefined));
  const { resultingNumOfVotes } = getRemainingAndResultingNumOfVotes(votes, account);

  if (areVotesInValid) {
    messages.push(t('Please enter vote amounts for the delegates you wish to vote for'));
  }

  if (resultingNumOfVotes > VOTE_LIMIT) {
    messages.push(t(`These votes in addition to your current votes will add up to ${resultingNumOfVotes}, exceeding the account limit of ${VOTE_LIMIT}.`));
  }

  const addedVoteAmount = Object.values(votes)
    .filter(vote => vote.unconfirmed > vote.confirmed)
    .reduce((sum,
      vote) => { sum += (vote.unconfirmed - vote.confirmed); return sum; }, 0);

  if ((addedVoteAmount + toRawLsk(fee)) > balance) {
    messages.push(t('You don\'t have enough LSK in your account.'));
  }

  if ((balance - addedVoteAmount) < MIN_ACCOUNT_BALANCE && (balance - addedVoteAmount)) {
    messages.push('The vote amounts are too high. You should keep 0.05 LSK available in your account.');
  }

  return { messages, error: !!messages.length };
};

const token = tokenMap.LSK.key;
const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.voteDelegate;

// eslint-disable-next-line max-statements
const Editor = ({
  t, votes, account, network, isVotingTxPending, nextStep,
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
    network,
    selectedPriority,
    token,
    account,
    priorityOptions,
    transaction: {
      moduleAssetId,
      nonce: account.sequence?.nonce,
      senderPublicKey: account.summary?.publicKey,
      votes: normalizedVotes,
    },
  });

  const {
    added, edited, removed, selfUnvote,
  } = useMemo(() =>
    getVoteStats(votes, account),
  [votes, account]);
  const { remainingVotes } = getRemainingAndResultingNumOfVotes(votes, account);

  const feedback = validateVotes(votes, Number(account.token?.balance), fee.value, account, t);

  const isCTADisabled = feedback.error || Object.keys(changedVotes).length === 0;

  const goToNextStep = () => {
    const feeValue = customFee ? customFee.value : fee.value;
    nextStep({
      added, edited, removed, selfUnvote, fee: toRawLsk(feeValue), normalizedVotes,
    });
  };

  const showEmptyState = !changedVotes.length || isVotingTxPending;

  return (
    <section className={styles.wrapper}>
      <Box>
        <ToggleIcon isNotHeader />
        <span className={styles.title}>{t('Voting queue')}</span>
        <div className={styles.headerContainer}>
          {!showEmptyState && (
            <div className={styles.votesAvailableCounter}>
              <span>{`${remainingVotes}/`}</span>
              <span>{t('{{VOTE_LIMIT}} Votes available', { VOTE_LIMIT })}</span>
            </div>
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
                minFee={Number(minFee.value)}
                customFee={customFee ? customFee.value : undefined}
                moduleAssetId={moduleAssetId}
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
                  disabled={isCTADisabled || isVotingTxPending}
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
