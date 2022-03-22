import React from 'react';
import moment from 'moment';
import { tokenMap } from '@constants';
import { isBlockHeightReached } from '@utils/account';
import Icon from '@views/basics/icon';
import LiskAmount from '@shared/liskAmount';

const getPendingTime = (unvoteHeight, unlockHeight) => {
  const awaitingBlocks = unlockHeight - unvoteHeight;
  const secondsToUnlockAllBalance = awaitingBlocks * 10;
  const momentSeconds = moment().second(secondsToUnlockAllBalance);
  return moment().to(momentSeconds, true);
};

const UnlockingListItem = ({ unvote, t, currentBlockHeight }) => (
  <li className="unlocking-balance">
    <p>
      <LiskAmount val={unvote.amount} token={tokenMap.LSK.key} />
    </p>
    <p>
      <Icon name="loading" />
      {`${t('will be available to unlock in')} ${getPendingTime(currentBlockHeight, unvote.height.end)}`}
    </p>
  </li>
);

/**
 * displays a list of vote amounts that can be unlocked sometime in the future
 */
const UnlockingList = ({ unlocking, currentBlockHeight, t }) => (
  unlocking
    .sort((unvoteA, unvoteB) => unvoteB.height.start - unvoteA.height.start)
    .map((unvote, i) => {
      if (isBlockHeightReached(unvote.height.end, currentBlockHeight)) {
        return null;
      }
      return (
        <UnlockingListItem
          key={`${i}-unlocking-balance-list`}
          unvote={unvote}
          currentBlockHeight={currentBlockHeight}
          t={t}
        />
      );
    })
);

export default UnlockingList;
