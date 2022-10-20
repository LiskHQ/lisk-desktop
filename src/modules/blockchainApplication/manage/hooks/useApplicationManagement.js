import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import defaultApps from '@tests/fixtures/blockchainApplicationsManage';
import { addApplication, deleteApplication } from '../store/action';
import { selectApplications } from '../store/selectors';
import { useCurrentApplication } from './useCurrentApplication';
import { usePinBlockchainApplication } from './usePinBlockchainApplication';

export function useApplicationManagement() {
  const dispatch = useDispatch();
  const [currentApplication, setCurrentApplication] = useCurrentApplication();
  const { checkPinByChainId, pins } = usePinBlockchainApplication();
  const applicationsObject = useSelector(selectApplications);

  // TODO: Applications list not updating after adding new application
  const applications = useMemo(
    () => {
      const appsList = Object.values(applicationsObject);
      return appsList.map((app) => ({
        ...app,
        isPinned: checkPinByChainId(app.chainID),
      })).sort((a) => (a.isPinned ? -1 : 1));
    },
    [applicationsObject, pins],
  );

  const setApplication = useCallback(
    (application) => {
      if (application.isDefault) return;
      dispatch(addApplication(application));
    },
    [],
  );

  const getApplicationByChainId = useCallback(
    (chainId) => applications.find((app) => app.chainID === chainId),
    [applications],
  );

  const deleteApplicationByChainId = useCallback(
    (chainId) => {
      dispatch(deleteApplication(chainId));
      if (currentApplication.chainID === chainId) {
        // Set Lisk as default if application in use is being deleted
        setCurrentApplication(defaultApps[0]);
      }
    },
    [],
  );

  return {
    applications, setApplication, getApplicationByChainId, deleteApplicationByChainId,
  };
}
