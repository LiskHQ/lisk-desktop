import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import defaultApps from '@tests/fixtures/blockchainApplicationsManage';
import { selectActiveTokenNetwork } from 'src/redux/selectors';
import { loadApplications, addApplication, deleteApplication } from '../store/action';
import { selectApplications } from '../store/selectors';
import { useCurrentApplication } from './useCurrentApplication';
import { usePinBlockchainApplication } from './usePinBlockchainApplication';

// eslint-disable-next-line max-statements
function useApplicationManagement() {
  const dispatch = useDispatch();
  const network = useSelector(selectActiveTokenNetwork);
  const [currentApplication, setApplication] = useCurrentApplication();
  const { checkPinByChainId } = usePinBlockchainApplication();
  const getAllApplications = async () => {
    dispatch(loadApplications({ network }));
  };
  getAllApplications();
  const applicationsObject = useSelector(selectApplications);
  const modifiedDefaultApps = defaultApps.map((app) => ({
    ...app,
    isDefault: true,
  }));
  const defaultChainIDs = defaultApps.map(app => app.chainID);
  const appsList = Object.keys(applicationsObject).map((app) => ({
    ...applicationsObject[app],
    isDefault: false,
  }));
  const applications = useMemo(
    () => [...appsList, ...modifiedDefaultApps].map((app) => ({
      ...app,
      isPinned: checkPinByChainId(app.chainID),
    })),
    [applicationsObject, defaultApps],
  );

  const setNewApplication = useCallback(
    (application) => dispatch(addApplication(application)),
    [],
  );

  const getApplicationByChainId = (chainId) => {
    const filterApplicationsByChainId = Object.keys(applicationsObject).filter(
      (applicationChainId) => applicationChainId === chainId,
    )[0];
    return applicationsObject[filterApplicationsByChainId];
  };

  const deleteApplicationByChainId = useCallback(
    async (chainId) => {
      if (defaultChainIDs.includes(chainId)) {
        toast.error('Default apps can not be deleted');
      } else {
        await dispatch(deleteApplication(chainId));
        if (currentApplication.chainID === chainId) {
          // Set Lisk as default if application in use is being deleted
          setApplication(defaultApps[0]);
        }
      }
    },
    [],
  );

  return {
    applications, setNewApplication, getApplicationByChainId, deleteApplicationByChainId,
  };
}

export default useApplicationManagement;
