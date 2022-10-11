import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsManage';
import client from 'src/utils/api/client';
import { selectCurrentApplication } from '../store/selectors';
import { setCurrentApplication } from '../store/action';
import { useCurrentNode } from './useCurrentNode';

// eslint-disable-next-line import/prefer-default-export
export function useCurrentApplication() {
  const dispatch = useDispatch();
  const currentApplication = useSelector(selectCurrentApplication);
  const { setCurrentNode } = useCurrentNode();
  const setApplication = useCallback(
    (application) => {
      dispatch(setCurrentApplication(application));
      /* istanbul ignore next */
      client.create(application?.serviceURLs[0]);
      setCurrentNode(application?.serviceURLs[0]);
    },
    [],
  );

  // @todo set hardcode default application needs to be fetch from api
  useEffect(() => {
    if (!currentApplication) {
      setApplication(mockBlockchainApplications[0]);
    }
  }, [currentApplication]);

  return [currentApplication ?? mockBlockchainApplications[0], setApplication];
}
