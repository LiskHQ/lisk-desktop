import React, { useState } from 'react';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import Icon from '../../../toolbox/icon';
import VoteListItem from './voteListItem';
import TransactionPriority from '../../../shared/transactionPriority';

import styles from './editor.css';
import { tokenMap } from '../../../../constants/tokens';
import { toRawLsk } from '../../../../utils/lsk';
import useTransactionFeeCalculation from '../../send/form/useTransactionFeeCalculation';
import useTransactionPriority from '../../send/form/useTransactionPriority';
import { PrimaryButton } from '../../../toolbox/buttons';

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
  Object.keys(votes).map(delegateAddress => ({
    delegateAddress,
    amount: (votes[delegateAddress].unconfirmed - votes[delegateAddress].confirmed),
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
  if (Object.keys(votes).length > 10) messages.push(t('You can\'t vote for more than 10 delegates.'));
  const addedVoteAmount = Object.values(votes)
    .filter(vote => vote.unconfirmed > vote.confirmed)
    .reduce((sum, vote) => { sum += (vote.unconfirmed - vote.confirmed); return sum; }, 0);
  if ((addedVoteAmount + toRawLsk(fee)) > balance) messages.push(t('You don\'t have enough LSK in your account.'));

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
  Object.values(votes).reduce((stats, { oldAmount, newAmount }) => {
    if (!oldAmount && newAmount) {
      // new vote
      stats.added++;
    } else if (oldAmount && !newAmount) {
      // removed vote
      stats.removed++;
    } else {
      // edited vote
      stats.edited++;
    }
    return stats;
  }, { added: 0, edited: 0, removed: 0 });

const token = tokenMap.LSK.key;
const txType = 'vote';

const Editor = ({
  t, votes, account, nextStep,
}) => {
  const [customFee, setCustomFee] = useState();
  const [
    selectedPriority, selectTransactionPriority, priorityOptions,
  ] = useTransactionPriority(token);

  const changedVotes = Object.keys(votes)
    .filter(address => votes[address].unconfirmed !== votes[address].confirmed)
    .reduce((filteredVotes, address) => {
      filteredVotes[address] = votes[address];
      return filteredVotes;
    }, {});

  const { fee, minFee } = useTransactionFeeCalculation({
    selectedPriority,
    token,
    account,
    priorityOptions,
    txData: {
      txType,
      nonce: account.nonce,
      senderPublicKey: account.publicKey,
      votes: normalizeVotesForTx(votes),
    },
  });

  const { added, edited, removed } = getVoteStats(votes);
  const feedback = validateVotes(votes, account.balance, fee.value, t);

  return (
    <section className={styles.wrapper}>
      <Box>
        <span className={styles.toggleIcon}>
          <Icon name="votingQueueActive" />
        </span>
        <header className={styles.header}>
          <span className={styles.heading}>{t('Voting Queue')}</span>
          <span className={styles.voteStats}>{`${added} ${t('added')}`}</span>
          <span className={styles.voteStats}>{`${edited} ${t('edited')}`}</span>
          <span className={styles.voteStats}>{`${removed} ${t('removed')}`}</span>
        </header>
        <BoxContent className={styles.contentContainer}>
          <div className={styles.contentHeader}>
            <span className={styles.infoColumn}>Delegate</span>
            <span className={styles.oldAmountColumn}>Old Vote Amount</span>
            <span className={styles.newAmountColumn}>New vote Amount</span>
            <span className={styles.editColumn} />
          </div>
          <div className={styles.contentScrollable}>
            {Object.keys(changedVotes).map((address, index) => (
              <VoteListItem
                key={index}
                t={t}
                address={address}
                username={changedVotes[address].username}
                confirmed={changedVotes[address].confirmed}
                unconfirmed={changedVotes[address].unconfirmed}
              />
            ))}
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
        />
        {
          feedback.error && <span className="feedback">{feedback.messages[0]}</span>
        }
        <BoxFooter>
          <PrimaryButton size="l" disabled={feedback.error} onClick={nextStep}>
            {t('Continue')}
          </PrimaryButton>

        </BoxFooter>
      </Box>
    </section>
  );
};

export default Editor;
