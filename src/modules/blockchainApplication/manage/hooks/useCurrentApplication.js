import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import client from 'src/utils/api/client';
import { stakesReset } from '@pos/validator/store/actions/staking';
import { selectCurrentApplication } from '../store/selectors';
import { setCurrentApplication } from '../store/action';

export function useCurrentApplication() {
  const dispatch = useDispatch();

  const currentApplication = useSelector(selectCurrentApplication);

  const setApplication = useCallback((application, applicationNode) => {
    dispatch(setCurrentApplication(application));
    /* istanbul ignore next */
    client.create(applicationNode || application.serviceURLs[0]);
    // clear stakes list during application switch
    dispatch(stakesReset());
  }, []);

  return [currentApplication ?? {}, setApplication];
}
