import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsManage';
import { selectCurrentApplication } from '../store/selectors';
import { setCurrentApplication } from '../store/action';

// eslint-disable-next-line import/prefer-default-export
export function useCurrentApplication() {
  const dispatch = useDispatch();
  const currentApplication = useSelector(selectCurrentApplication);
  const setApplication = useCallback(
    (application) => dispatch(setCurrentApplication(application)),
    [],
  );

  useEffect(() => {
    if (!currentApplication) {
      setApplication(mockBlockchainApplications[0]);
    }
  }, [currentApplication]);

  return [currentApplication, setApplication];
}
