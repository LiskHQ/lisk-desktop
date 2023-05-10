import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentAccount } from '@account/store/selectors';
import { selectStaking } from 'src/redux/selectors';
import { stakesReset } from '@pos/validator/store/actions/staking';
import {
  removeThenAppendSearchParamsToUrl,
  removeSearchParamsFromUrl,
} from 'src/utils/searchParams';
import { createConfirmSwitchState } from '@common/utils/createConfirmSwitchState';
import routes from 'src/routes/routes';
import { setCurrentAccount } from '../store/action';

// eslint-disable-next-line
export function useCurrentAccount(history) {
  const dispatch = useDispatch();
  const stakingQueue = useSelector(selectStaking);
  const pendingStakes = Object.values(stakingQueue).filter(
    (stake) => stake.confirmed !== stake.unconfirmed
  );

  const setAccount = (encryptedAccount, referrer) => {
    // clear stakes list during login or accounts switch
    if (pendingStakes.length && history) {
      const onCancel = /* istanbul ignore next */ () =>
        removeSearchParamsFromUrl(history, ['modal']);
      const onConfirm = /* istanbul ignore next */ () => {
        dispatch(setCurrentAccount(encryptedAccount));

        dispatch(stakesReset());
        history.push(referrer || routes.wallet.path);
      };
      const state = createConfirmSwitchState({
        mode: 'pendingStakes',
        type: 'account',
        onCancel,
        onConfirm,
      });
      removeThenAppendSearchParamsToUrl(history, { modal: 'confirmationDialog' }, ['modal'], state);
    } else {
      dispatch(setCurrentAccount(encryptedAccount));
      history?.push(referrer || routes.wallet.path);
    }
  };
  const currentAccount = useSelector(selectCurrentAccount);

  return [currentAccount, setAccount];
}
