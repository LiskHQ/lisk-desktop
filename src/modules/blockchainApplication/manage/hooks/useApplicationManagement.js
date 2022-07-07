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
  const filterApplicationsByChainId = (chainId) =>
    Object.keys(applications).filter((application) => application.chainID === chainId)[0];
  const getApplicationByChainId = applications[filterApplicationsByChainId];
  const deleteApplicationByChainId = useCallback(
    (chainId) => dispatch(deleteApplication(chainId)),
    [],
  );

  return {
    applications, setNewApplication, getApplicationByChainId, deleteApplicationByChainId,
  };
}

export default useApplicationManagement;
