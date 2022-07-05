import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPinnedApplications } from '@blockchainApplication/manage/store/selectors';
import { toggleApplicationPin } from '../../manage/store/action';

// eslint-disable-next-line
export function usePinBlockchainApplication() {
  const dispatch = useDispatch();
  const pins = useSelector(selectPinnedApplications);

  const togglePin = useCallback((chainId) => dispatch(toggleApplicationPin(chainId)), []);
  const checkPinByChainId = useCallback((chainId) => pins.includes(chainId), [pins]);
  return {
    pins, togglePin, checkPinByChainId,
  };
}
