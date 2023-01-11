import { useSelector } from 'react-redux';
import {
  calculateBalanceLockedInVotes,
  calculateUnlockableBalance,
  getUnlockableUnlockObjects,
} from '@wallet/utils/account';
import {
  selectActiveTokenAccount,
} from 'src/redux/selectors';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';

const useUnlockableCalculator = () => {
  const wallet = useSelector(selectActiveTokenAccount);
  const { data: { height: currentHeight } } = useLatestBlock();
  const lockedInVotes = useSelector(state => calculateBalanceLockedInVotes(state.staking));
  const unlockableBalance = calculateUnlockableBalance(
    wallet.pos?.pendingUnlocks, currentHeight,
  );
  const unlockObjects = getUnlockableUnlockObjects(wallet.pos?.pendingUnlocks, currentHeight);
  return [unlockObjects, lockedInVotes, unlockableBalance];
};

export default useUnlockableCalculator;
