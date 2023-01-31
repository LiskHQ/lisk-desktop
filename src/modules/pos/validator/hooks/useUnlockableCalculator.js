import {
  calculateSentStakesAmount,
  calculateUnlockableAmount,
  getPendingUnlockableUnlocks,
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
  const pendingUnlockableUnlocks = getPendingUnlockableUnlocks(pendingUnlocks);
  const sentStakesAmount = calculateSentStakesAmount(sentStakes?.data?.stakes);

  return { pendingUnlockableUnlocks, sentStakesAmount, unlockableAmount };
};

export default useUnlockableCalculator;
