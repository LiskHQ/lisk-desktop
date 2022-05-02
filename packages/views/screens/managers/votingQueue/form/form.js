import React, { useMemo, useState } from 'react';
import { tokenMap } from '@token/configuration/tokens';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { MIN_ACCOUNT_BALANCE } from '@transaction/configuration/transactions';
import { toRawLsk } from '@token/utilities/lsk';
import TransactionPriority, {
  useTransactionFeeCalculation,
  useTransactionPriority,
} from '@transaction/components/TransactionPriority';
import { normalizeVotesForTx } from '@transaction/utils';
import Box from '@basics/box';
import BoxContent from '@basics/box/content';
import BoxFooter from '@basics/box/footer';
import { PrimaryButton } from '@basics/buttons';

import Table from '@basics/table';
import ToggleIcon from '../toggleIcon';

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
const getVoteStats = (votes, account) => {
  const votesStats = Object.keys(votes)
    // eslint-disable-next-line max-statements
    .reduce((stats, address) => {
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
    }, {
      added: {}, edited: {}, removed: {}, untouched: {}, selfUnvote: {},
    });

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
 * @returns {Object} The feedback object including error status and messages
 */
// eslint-disable-next-line max-statements
const validateVotes = (votes, balance, fee, resultingNumOfVotes, t) => {
  const messages = [];
  const areVotesInValid = Object.values(votes).some(vote =>
    (vote.unconfirmed === '' || vote.unconfirmed === undefined));

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
    wallet: account,
    priorityOptions,
    transaction: {
      moduleAssetId,
      nonce: account.sequence?.nonce,
      senderPublicKey: account.summary?.publicKey,
      votes: normalizedVotes,
    },
  });

  const {
    added, edited, removed, selfUnvote, availableVotes, resultingNumOfVotes,
  } = useMemo(() =>
    getVoteStats(votes, account),
  [votes, account]);

  const feedback = validateVotes(
    votes, Number(account.token?.balance), fee.value, resultingNumOfVotes, t,
  );

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
        <div className={styles.headerContainer}>
          {!showEmptyState && (
            <>
              <span className={styles.title}>{t('Voting queue')}</span>
              <div className={styles.votesAvailableCounter}>
                <span className="available-votes-num">{`${availableVotes}/`}</span>
                <span>{t('{{VOTE_LIMIT}} votes available for your account', { VOTE_LIMIT })}</span>
              </div>
            </>
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
