import { useSelector } from 'react-redux';
import {
  calculateBalanceLockedInVotes,
  calculateUnlockableBalance,
  getUnlockableUnlockObjects,
} from '@wallet/utils/account';
import {
  selectCurrentBlockHeight,
  selectActiveTokenAccount,
} from 'src/redux/selectors';

const useUnlockableCalculator = () => {
  const wallet = useSelector(selectActiveTokenAccount);
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const lockedInVotes = useSelector(state => calculateBalanceLockedInVotes(state.voting));
  const unlockableBalance = calculateUnlockableBalance(
    wallet.dpos?.unlocking, currentBlockHeight,
  );
  const unlockObjects = getUnlockableUnlockObjects(wallet.dpos?.unlocking, currentBlockHeight);
  return [unlockObjects, lockedInVotes, unlockableBalance];
};

export default useUnlockableCalculator;
