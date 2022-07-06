import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectApplications } from '../store/selectors';
import { deleteApplication } from '../store/action';

function useApplicationManagement() {
  const dispatch = useDispatch();
  const applications = useSelector(selectApplications);
  const addApplication = () => {};
  const filterApplicationsByChainId = (chainId) =>
    Object.keys(applications).filter((application) => application.chainId === chainId)[0];
  const getApplicationByChainId = applications[filterApplicationsByChainId];
  const deleteApplicationByChainId = useCallback(
    (chainId) => dispatch(deleteApplication(chainId)),
    [],
  );

  return {
    applications, addApplication, getApplicationByChainId, deleteApplicationByChainId,
  };
}

export default useApplicationManagement;
