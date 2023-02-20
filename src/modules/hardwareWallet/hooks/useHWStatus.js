import { useSelector } from 'react-redux';
import { selectActiveHardwareDevice } from '../store/selectors/hwSelectors';

const useHWStatus = () => {
  const hwDetails = useSelector(selectActiveHardwareDevice);
  const { deviceId, model, brand, status } = hwDetails || {};

  return {
    deviceId,
    model,
    brand,
    status,
  };
};

export default useHWStatus;
