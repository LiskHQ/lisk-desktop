import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import client from 'src/utils/api/client';
import { selectStaking } from 'src/redux/selectors';
import { stakesReset } from 'src/redux/actions';
import {
  removeThenAppendSearchParamsToUrl,
  removeSearchParamsFromUrl,
} from 'src/utils/searchParams';
import { selectCurrentApplication } from '../store/selectors';
import { setCurrentApplication } from '../store/action';

export function useCurrentApplication(history) {
  const dispatch = useDispatch();

  const currentApplication = useSelector(selectCurrentApplication);
  const stakingQueue = useSelector(selectStaking);
  const pendingStakes = Object.values(stakingQueue).filter(
    (stake) => stake.confirmed !== stake.unconfirmed
  );

  const setApplication = useCallback((application, applicationNode) => {
    dispatch(setCurrentApplication(application));
    /* istanbul ignore next */
    client.create(applicationNode || application.serviceURLs[0]);
    // clear stakes list during application switch
    if (pendingStakes.length) {
      const state = {
        header: 'Pending Stakes',
        content:
          'Switching your application and (or) network will remove all your pending stakes. Are you sure you want to continue?',
        cancelText: 'Cancel switch',
        cancelFn: removeSearchParamsFromUrl(history, ['modal']),
        confirmText: 'Continue to switch',
        confirmFn: () => dispatch(stakesReset()),
      };
      removeThenAppendSearchParamsToUrl(
        history,
        { modal: 'confirmationDialog' },
        ['modal'],
        undefined,
        state
      );
    }
  }, []);

  return [currentApplication ?? {}, setApplication];
}
