import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addApplication, deleteApplication } from '../store/action';
import { selectApplications } from '../store/selectors';

function useApplicationManagement() {
  const dispatch = useDispatch();
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
    (chainId) => dispatch(deleteApplication(chainId)),
    [],
  );

  return {
    applications, setNewApplication, getApplicationByChainId, deleteApplicationByChainId,
  };
}

export default useApplicationManagement;
