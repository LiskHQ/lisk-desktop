import React from 'react';
import moment from 'moment';
import { tokenMap } from '@token/fungible/consts/tokens';
import { isBlockHeightReached } from '@wallet/utils/account';
import Icon from 'src/theme/Icon';
import TokenAmount from '@token/fungible/components/tokenAmount';

const getPendingTime = (unstakeHeight, unlockHeight) => {
  const awaitingBlocks = unlockHeight - unstakeHeight;
  const secondsToUnlockAllBalance = awaitingBlocks * 10;
  const momentSeconds = moment().second(secondsToUnlockAllBalance);
  return moment().to(momentSeconds, true);
};

const UnlockingListItem = ({ unvote, t, currentBlockHeight }) => (
  <li className="unlocking-balance">
    <p>
      <TokenAmount val={unvote.amount} token={tokenMap.LSK.key} />
    </p>
    <p>
      <Icon name="loading" />
      {`${t('will be available to unlock in')} ${getPendingTime(currentBlockHeight, unvote.expectedUnlockableHeight)}`}
    </p>
  </li>
);

/**
 * displays a list of vote amounts that can be unlocked sometime in the future
 */
const UnlockingList = ({ pendingUnlocks, currentBlockHeight, t }) => (
  pendingUnlocks
    .sort((unvoteA, unvoteB) => unvoteB.unstakeHeight - unvoteA.unstakeHeight)
    .map((unvote, i) => {
      if (isBlockHeightReached(unvote.expectedUnlockableHeight, currentBlockHeight)) {
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
