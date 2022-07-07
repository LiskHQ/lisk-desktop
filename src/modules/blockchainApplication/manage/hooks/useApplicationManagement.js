import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import blockchainApplicationsManage from '@tests/fixtures/blockchainApplicationsManage';
import { addApplication, deleteApplication } from '../store/action';
import { selectApplications } from '../store/selectors';
import { useCurrentApplication } from './useCurrentApplication';

function useApplicationManagement() {
  const dispatch = useDispatch();
  const [currentApplication, setApplication] = useCurrentApplication();
  const applications = useSelector(selectApplications);

  const setNewApplication = useCallback(
    (application) => dispatch(addApplication(application)),
    [],
  );

  const getApplicationByChainId = (chainId) => {
    const filterApplicationsByChainId = Object.keys(applications).filter(
      (applicationChainId) => applicationChainId === chainId,
    )[0];
    return applications[filterApplicationsByChainId];
  };

  const deleteApplicationByChainId = useCallback(
    async (chainId) => {
      await dispatch(deleteApplication(chainId));
      if (currentApplication.chainID === chainId) {
        // Set Lisk as default if application in use is being deleted
        setApplication(blockchainApplicationsManage[0]);
      }
    },
    [],
  );

  return {
    applications, setNewApplication, getApplicationByChainId, deleteApplicationByChainId,
  };
}

export default useApplicationManagement;
