import {
  calculateSentStakesAmount,
  calculateUnlockedAmount,
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

  console.log('useUnlockableCalculator pendingUnlocks', pendingUnlocks);

  const unlockedAmount = calculateUnlockedAmount(pendingUnlocks);
  const lockedPendingUnlocks = getLockedPendingUnlocks(pendingUnlocks);
  const sentStakesAmount = calculateSentStakesAmount(sentStakes?.data?.stakes);

  return { lockedPendingUnlocks, sentStakesAmount, unlockedAmount };
};

export default useUnlockableCalculator;
