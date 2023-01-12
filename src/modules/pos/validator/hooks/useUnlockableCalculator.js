import { useSelector } from 'react-redux';
import { calculateBalanceLockedInVotes, calculateUnlockableBalance } from '@wallet/utils/account';
import { useUnlocks } from '@pos/validator/hooks/queries';
import { useCurrentAccount } from '@account/hooks';

const useUnlockableCalculator = () => {
  const [currentAccount] = useCurrentAccount();
  const { data: unlocks } = useUnlocks({
    config: { params: { address: currentAccount?.metaData?.address } },
  });
  const pendingUnlocks = unlocks?.data?.pendingUnlocks;

  const unlockableBalance = calculateUnlockableBalance(pendingUnlocks);
  const lockedInVotes = useSelector((state) => calculateBalanceLockedInVotes(state.staking));

  return { pendingUnlocks, lockedInVotes, unlockableBalance };
};

export default useUnlockableCalculator;
