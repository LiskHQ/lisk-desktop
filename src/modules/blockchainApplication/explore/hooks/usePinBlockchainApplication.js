import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPinnedApplications } from '@blockchainApplication/explore/store/selectors';
import { pinApplication, removePinnedApplication } from '../store/action';

// eslint-disable-next-line
export function usePinBlockchainApplication() {
  const dispatch = useDispatch();
  const pins = useSelector(selectPinnedApplications);

  const setPin = useCallback((chainId) => dispatch(pinApplication(chainId)), []);
  const deletePin = useCallback(
    (chainId) => dispatch(removePinnedApplication(chainId)),
    [],
  );
  const checkPinByChainId = useCallback((chainId) => pins.includes(chainId), []);

  return {
    pins, setPin, deletePin, checkPinByChainId,
  };
}
