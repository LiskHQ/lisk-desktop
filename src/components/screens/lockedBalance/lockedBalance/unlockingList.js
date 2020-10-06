import React from 'react';
import moment from 'moment';
import Icon from '../../../toolbox/icon';
import { getDelayedAvailability, isBlockHeightReached } from '../../../../utils/account';
import LiskAmount from '../../../shared/liskAmount';
import { tokenMap } from '../../../../constants/tokens';

const getPendingTime = ({ unvoteHeight, delegateAddress }, currentBlockHeight, { address }) => {
  const isSelfVote = address === delegateAddress;
  const delayedAvailability = getDelayedAvailability(isSelfVote);
  const awaitingBlocks = delayedAvailability - (currentBlockHeight - unvoteHeight);
  const secondsToUnlockAllBalance = awaitingBlocks * 10;
  const momentSeconds = moment().second(secondsToUnlockAllBalance);
  return moment().to(momentSeconds, true);
};

const UnlockingListItem = ({
  vote,
  currentBlock,
  t,
  account,
}) => (
  <li className="unlocking-balance">
    <p>
      <LiskAmount val={vote.amount} token={tokenMap.LSK.key} />
    </p>
    <p>
      <Icon name="loading" />
      {`${t('will be available to unlock in')} ${getPendingTime(vote, currentBlock.height, account)}`}
    </p>
  </li>
);

const UnlockingList = ({ account, currentBlock, t }) => (
  account.unlocking
    .sort((voteA, voteB) => voteB.unvoteHeight - voteA.unvoteHeight)
    .map((vote, i) => {
      if (isBlockHeightReached(vote, currentBlock, account.address)) return false;
      return (
        <UnlockingListItem
          key={`${i}-unlocking-balance-list`}
          vote={vote}
          currentBlock={currentBlock}
          account={account}
          t={t}
        />
      );
    })
);

export default UnlockingList;
