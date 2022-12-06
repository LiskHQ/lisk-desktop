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
  const lockedInVotes = useSelector(state => calculateBalanceLockedInVotes(state.voting));
  const unlockableBalance = calculateUnlockableBalance(
    wallet.dpos?.unlocking, currentHeight,
  );
  const unlockObjects = getUnlockableUnlockObjects(wallet.dpos?.unlocking, currentHeight);
  return [unlockObjects, lockedInVotes, unlockableBalance];
};

export default useUnlockableCalculator;
