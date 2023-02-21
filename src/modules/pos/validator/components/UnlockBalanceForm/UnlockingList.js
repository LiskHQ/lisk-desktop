import React from 'react';
import moment from 'moment';
import { tokenMap } from '@token/fungible/consts/tokens';
import Icon from 'src/theme/Icon';
import TokenAmount from '@token/fungible/components/tokenAmount';

const getPendingTime = (unstakeHeight, unlockHeight) => {
  const awaitingBlocks = unlockHeight - unstakeHeight;
  const secondsToUnlockAllBalance = awaitingBlocks * 10;
  const momentSeconds = moment().second(secondsToUnlockAllBalance);
  return moment().to(momentSeconds, true);
};

const UnlockingListItem = ({ pendingUnlockableUnlock, t, currentBlockHeight }) => (
  <li className="unlocking-balance">
    <p>
      <TokenAmount val={pendingUnlockableUnlock.amount} token={tokenMap.LSK.key} />
    </p>
    <p>
      <Icon name="loading" />
      {`${t('will be available to unlock in')} ${getPendingTime(
        currentBlockHeight,
        pendingUnlockableUnlock.expectedUnlockableHeight
      )}`}
    </p>
  </li>
);

/**
 * displays a list of stake amounts that can be unlocked sometime in the future
 */
const UnlockingList = ({ lockedPendingUnlocks, currentBlockHeight, t }) =>
  lockedPendingUnlocks
    .sort((unstakeA, unstakeB) => unstakeB.unstakeHeight - unstakeA.unstakeHeight)
    .map((pendingUnlockableUnlock, i) => (
      <UnlockingListItem
        key={`${i}-unlocking-balance-list`}
        pendingUnlockableUnlock={pendingUnlockableUnlock}
        currentBlockHeight={currentBlockHeight}
        t={t}
      />
    ));

export default UnlockingList;
