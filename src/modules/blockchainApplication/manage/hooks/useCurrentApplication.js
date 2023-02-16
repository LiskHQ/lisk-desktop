import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import client from 'src/utils/api/client';
import { selectCurrentApplication } from '../store/selectors';
import { setCurrentApplication } from '../store/action';
import { useCurrentNode } from './useCurrentNode';

export function useCurrentApplication() {
  const dispatch = useDispatch();

  const currentApplication = useSelector(selectCurrentApplication);

  const { setCurrentNode } = useCurrentNode();

  const setApplication = useCallback(
    (application) => {
      dispatch(setCurrentApplication(application));
      // @TODO: probe to verify if serviceURL is reachable
      /* istanbul ignore next */
      client.create(application.serviceURLs[1]);
      setCurrentNode(application.serviceURLs[1]);
    },
    [],
  );

  return [currentApplication ?? {}, setApplication];
}
