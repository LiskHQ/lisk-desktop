import React from 'react';
import moment from 'moment';
import Icon from 'src/theme/Icon';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { useNetworkStatus } from '@network/hooks/queries';
import usePosToken from '../../hooks/usePosToken';

const getPendingTime = (expectedUnlockableHeight, currentHeight, blockTime) => {
  const awaitingBlocks = expectedUnlockableHeight - currentHeight;
  const secondsToUnlockAllBalance = awaitingBlocks / blockTime;
  const momentSeconds = moment().second(secondsToUnlockAllBalance);
  return moment().to(momentSeconds, secondsToUnlockAllBalance > 0);
};

const UnlockingListItem = ({ lockedPendingUnlock, t, currentBlockHeight, token, blockTime }) => (
  <li className="unlocking-balance">
    <p>
      <TokenAmount val={lockedPendingUnlock.amount} token={token} />
    </p>
    <p>
      <Icon name="loading" />
      {`${t('will be available to unlock in')} ${getPendingTime(
        lockedPendingUnlock.expectedUnlockableHeight,
        currentBlockHeight,
        blockTime
      )}`}
    </p>
  </li>
);

/**
 * displays a list of stake amounts that can be unlocked sometime in the future
 */
const UnlockingList = ({ lockedPendingUnlocks, currentBlockHeight, t }) => {
  const { token } = usePosToken();
  const { data: networkStatus } = useNetworkStatus();

  return lockedPendingUnlocks
    .sort((unstakeA, unstakeB) => unstakeB.unstakeHeight - unstakeA.unstakeHeight)
    .map((lockedPendingUnlock, i) => (
      <UnlockingListItem
        key={`${i}-unlocking-balance-list`}
        lockedPendingUnlock={lockedPendingUnlock}
        currentBlockHeight={currentBlockHeight}
        token={token}
        blockTime={networkStatus.data.genesis.blockTime}
        t={t}
      />
    ));
};

export default UnlockingList;
