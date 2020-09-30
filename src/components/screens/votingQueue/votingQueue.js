import React, { useState } from 'react';
import Box from '../../toolbox/box';
import BoxContent from '../../toolbox/box/content';
import BoxFooter from '../../toolbox/box/footer';
import Icon from '../../toolbox/icon';
import VoteListItem from './voteListItem';
import TransactionPriority from '../../shared/transactionPriority';

import styles from './votingQueue.css';
import { tokenMap } from '../../../constants/tokens';
// import transactionTypes from '../../../constants/transactionTypes';
import useTransactionFeeCalculation from '../send/form/useTransactionFeeCalculation';
import useTransactionPriority from '../send/form/useTransactionPriority';
import { PrimaryButton } from '../../toolbox/buttons';

const dummyVotes = Array.from(Array(20).keys()).map(i => ({
  address: `123${i}L`, oldAmount: i, newAmount: 1000 + i, username: `haha-${i}`,
}));

const getVoteStats = (votes) => {
  const count = { added: 0, edited: 0, removed: 0 };
  votes.forEach(({ oldAmount, newAmount }) => {
    if (!oldAmount && newAmount) {
      // new vote
      count.added++;
    } else if (oldAmount && !newAmount) {
      // removed vote
      count.removed++;
    } else {
      // edited vote
      count.edited++;
    }
  });
  return count;
};

const token = tokenMap.LSK.key;
const txType = 'vote';

const VotingQueue = (props) => {
  const {
    t = s => s, votes = dummyVotes, account,
  } = props;

  const [customFee, setCustomFee] = useState();
  const [
    selectedPriority, selectTransactionPriority, priorityOptions,
  ] = useTransactionPriority(token);

  const { fee, minFee } = useTransactionFeeCalculation({
    selectedPriority,
    token,
    account,
    priorityOptions,
    txData: {
      txType,
      nonce: account.nonce,
      senderPublicKey: account.publicKey,
      votes,
    },
  });

  const { added, edited, removed } = getVoteStats(votes);

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
            {votes.map((vote, index) => (
              <VoteListItem
                key={index}
                t={t}
                address={vote.address}
                username={vote.username}
                oldAmount={vote.oldAmount}
                newAmount={vote.newAmount}
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

        <BoxFooter>
          <PrimaryButton size="l" disabled>
            {t('Continue')}
          </PrimaryButton>

        </BoxFooter>
      </Box>
    </section>
  );
};

export default VotingQueue;
