import {
  calculateSentStakesAmount,
  calculateUnlockableAmount,
  getLockedPendingUnlocks,
} from '@wallet/utils/account';
import { useSentStakes, useUnlocks } from '@pos/validator/hooks/queries';
import { useCurrentAccount } from '@account/hooks';

const useUnlockableCalculator = () => {
  const [currentAccount] = useCurrentAccount();
  const address = currentAccount?.metadata?.address;

  const { data: unlocks } = useUnlocks({
    config: { params: { address } },
  });
  const { data: sentStakes } = useSentStakes({
    config: { params: { address } },
  });

  const pendingUnlocks = unlocks?.data?.pendingUnlocks;

  const unlockableAmount = calculateUnlockableAmount(pendingUnlocks);
  const lockedPendingUnlocks = getLockedPendingUnlocks(pendingUnlocks);
  const sentStakesAmount = calculateSentStakesAmount(sentStakes?.data?.stakes);

  return { lockedPendingUnlocks, sentStakesAmount, unlockableAmount };
};

export default useUnlockableCalculator;
