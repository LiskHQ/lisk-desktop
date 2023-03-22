import React from 'react';
import moment from 'moment';
import Icon from 'src/theme/Icon';
import TokenAmount from '@token/fungible/components/tokenAmount';
import usePosToken from '../../hooks/usePosToken';

const getPendingTime = (unstakeHeight, unlockHeight) => {
  const awaitingBlocks = unlockHeight - unstakeHeight;
  const secondsToUnlockAllBalance = awaitingBlocks * 10;
  const momentSeconds = moment().second(secondsToUnlockAllBalance);
  return moment().to(momentSeconds, true);
};

const UnlockingListItem = ({ lockedPendingUnlock, t, currentBlockHeight, token }) => (
  <li className="unlocking-balance">
    <p>
      <TokenAmount val={lockedPendingUnlock.amount} token={token} />
    </p>
    <p>
      <Icon name="loading" />
      {`${t('will be available to unlock in')} ${getPendingTime(
        currentBlockHeight,
        lockedPendingUnlock.expectedUnlockableHeight
      )}`}
    </p>
  </li>
);

/**
 * displays a list of stake amounts that can be unlocked sometime in the future
 */
const UnlockingList = ({ lockedPendingUnlocks, currentBlockHeight, t }) => {
  const { token } = usePosToken();

  return lockedPendingUnlocks
    .sort((unstakeA, unstakeB) => unstakeB.unstakeHeight - unstakeA.unstakeHeight)
    .map((lockedPendingUnlock, i) => (
      <UnlockingListItem
        key={`${i}-unlocking-balance-list`}
        lockedPendingUnlock={lockedPendingUnlock}
        currentBlockHeight={currentBlockHeight}
        token={token}
        t={t}
      />
    ));
};

export default UnlockingList;
