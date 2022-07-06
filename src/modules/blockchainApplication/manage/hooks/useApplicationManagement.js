import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { filterApplicationsByChainId } from '../store/action';

function useApplicationManagement() {
  const dispatch = useDispatch();
  const applications = [];
  const setApplication = () => {};
  const getApplicationByChainId = useCallback(
    (chainId) => dispatch(filterApplicationsByChainId(chainId)),
    [],
  );
  const deleteApplicationByChainId = () => {};
  return {
    applications, setApplication, getApplicationByChainId, deleteApplicationByChainId,
  };
}

export default useApplicationManagement;
