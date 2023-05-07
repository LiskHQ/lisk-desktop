import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import client from 'src/utils/api/client';
import { selectStaking } from 'src/redux/selectors';
import { removeSearchParams } from 'src/utils/searchParams';
import { selectCurrentApplication } from '../store/selectors';
import { setCurrentApplication } from '../store/action';

export function useCurrentApplication() {
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
      const [urlOrigin, searchParams] = window.location.href.split('?');
      const modifiedSearchPrams = removeSearchParams(searchParams, ['modal']);
      window.location = `${urlOrigin}${modifiedSearchPrams}&modal=confirmationDialog&mode=pendingStakes&contentType=switchAppOrNetwork`;
    }
  }, []);

  return [currentApplication ?? {}, setApplication];
}
