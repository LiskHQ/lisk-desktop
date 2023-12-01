import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSettings from '@settings/hooks/useSettings';
import { addApplication, deleteApplication, setApplications as setApps } from '../store/action';
import { selectApplications } from '../store/selectors';
import { useCurrentApplication } from './useCurrentApplication';
import { usePinBlockchainApplication } from './usePinBlockchainApplication';
import { useApplicationExploreAndMetaData } from './useApplicationExploreAndMetaData';

// eslint-disable-next-line max-statements
export function useApplicationManagement({ queryClient } = {}) {
  const dispatch = useDispatch();
  const [currentApplication, setCurrentApplication] = useCurrentApplication();
  const { applications: defaultApplications, isLoading } = useApplicationExploreAndMetaData({
    options: { ...(queryClient && { client: queryClient }) },
  });
  const { mainChainNetwork = {} } = useSettings('mainChainNetwork');

  const { checkPinByChainId, pins } = usePinBlockchainApplication();
  const applicationsObject = useSelector(selectApplications)[mainChainNetwork.name] || {};

  const applications = useMemo(() => {
    const appsList = Object.values(applicationsObject);
    // Sort apps list by pinned apps and terminated apps such that
    // pinned apps are at the beginning while terminated apps are at the end of the array
    return appsList
      .map((app) => ({
        ...app,
        isPinned: checkPinByChainId(app.chainID),
      }))
      .sort(
        (a, b) =>
          b.isPinned - a.isPinned ||
          Number(a.status === 'terminated') - Number(b.status === 'terminated')
      );
  }, [applicationsObject, pins]);

  const setApplication = useCallback((application) => {
    if (application.isDefault) return;
    dispatch(addApplication(application, mainChainNetwork.name));
  }, []);

  const setApplications = (apps) => {
    dispatch(setApps(apps, mainChainNetwork.name));
  };

  const getApplicationByChainId = useCallback(
    (chainID) => applications.find((app) => app.chainID === chainID),
    [applications]
  );

  const deleteApplicationByChainId = useCallback((chainID) => {
    const userApplication = getApplicationByChainId(chainID);
    if (userApplication.isDefault) return;

    dispatch(deleteApplication(chainID, mainChainNetwork.name));
    if (currentApplication.chainID === chainID) {
      // Set Lisk as default if application in use is being deleted
      setCurrentApplication(defaultApplications[0]);
    }
  }, []);

  return {
    isLoading,
    applications,
    setApplication,
    setApplications,
    getApplicationByChainId,
    deleteApplicationByChainId,
  };
}
