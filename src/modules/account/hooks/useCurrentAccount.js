import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
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

export function useCurrentAccount() {
  const dispatch = useDispatch();
  const history = useHistory();
  const stakingQueue = useSelector(selectStaking);
  const pendingStakes = Object.values(stakingQueue).filter(
    (stake) => stake.confirmed !== stake.unconfirmed
  );

  // eslint-disable-next-line max-statements
  const setAccount = (encryptedAccount, referrer, redirect = true, urlState) => {
    // clear stakes list during login or accounts switch
    const relativeUrlPath = referrer || routes.wallet.path;

    function pushUrlState() {
      const { pathname, search } = new URL(relativeUrlPath, window.location.origin);
      history.push({
        pathname,
        search,
        state: urlState,
      });
    }

    if (pendingStakes.length) {
      if (urlState) {
        dispatch(setCurrentAccount(encryptedAccount));
        dispatch(stakesReset());
        pushUrlState();
      } else {
        const onCancel = /* istanbul ignore next */ () =>
          removeSearchParamsFromUrl(history, ['modal']);
        const onConfirm = /* istanbul ignore next */ () => {
          dispatch(setCurrentAccount(encryptedAccount));

          dispatch(stakesReset());
          history.push(relativeUrlPath);
        };
        const state = createConfirmSwitchState({
          mode: 'pendingStakes',
          type: 'account',
          onCancel,
          onConfirm,
        });
        removeThenAppendSearchParamsToUrl(
          history,
          { modal: 'confirmationDialog' },
          ['modal'],
          state
        );
      }
    } else {
      dispatch(setCurrentAccount(encryptedAccount));
      if (redirect) {
        if (urlState) {
          pushUrlState();
        } else {
          history.push(relativeUrlPath);
        }
      }
    }
    // Remove toast between account switches
    toast.dismiss();
  };

  const currentAccount = useSelector(selectCurrentAccount);

  return [currentAccount, setAccount];
}
