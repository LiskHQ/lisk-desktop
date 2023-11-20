import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import client from 'src/utils/api/client';
import { selectStaking } from 'src/redux/selectors';
import { stakesReset } from 'src/redux/actions';
import {
  removeThenAppendSearchParamsToUrl,
  removeSearchParamsFromUrl,
} from 'src/utils/searchParams';
import { createConfirmSwitchState } from '@common/utils/createConfirmSwitchState';
import { selectCurrentApplication } from '../store/selectors';
import { setCurrentApplication } from '../store/action';

export function useCurrentApplication() {
  const dispatch = useDispatch();
  const history = useHistory();

  const currentApplication = useSelector(selectCurrentApplication);
  const stakingQueue = useSelector(selectStaking);
  const pendingStakes = Object.values(stakingQueue).filter(
    (stake) => stake.confirmed !== stake.unconfirmed
  );

  const setApplication = useCallback((application, applicationNode) => {
    // clear stakes list during application switch
    if (pendingStakes.length) {
      const onConfirm = /* istanbul ignore next */ () => {
        dispatch(setCurrentApplication(application));
        client.create(applicationNode || application.serviceURLs[0]);

        dispatch(stakesReset());
        // Remove toast between application switches
        toast.dismiss();
        removeSearchParamsFromUrl(history, ['modal']);
      };
      const onCancel = /* istanbul ignore next */ () =>
        removeSearchParamsFromUrl(history, ['modal']);
      const state = createConfirmSwitchState({
        mode: 'pendingStakes',
        type: 'application',
        onConfirm,
        onCancel,
      });
      removeThenAppendSearchParamsToUrl(history, { modal: 'confirmationDialog' }, ['modal'], state);
    } else {
      dispatch(stakesReset());
      dispatch(setCurrentApplication(application));
      // Remove toast between application switches
      toast.dismiss();
      /* istanbul ignore next */
      client.create(applicationNode || application.serviceURLs[0]);
    }
  }, []);

  return [currentApplication ?? {}, setApplication];
}
