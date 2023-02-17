import { useDispatch, useSelector } from 'react-redux';
import { IPC_MESSAGES } from '@libs/hwServer/constants';
import { selectHW } from 'src/redux/selectors';
import HWManager from '../manager/HWManager';
import { updateHWData } from '../store/actions/actions';

const useHWStatus = () => {
  const dispatch = useDispatch();

  HWManager.subscribe(IPC_MESSAGES.DEVICE_UPDATE, ({ device }) => {
    // store device details
    const { deviceId, model, brand, status } = device;
    const deviceData = { deviceId, model, brand, status };
    dispatch(updateHWData(deviceData));
  });

  const hwDetails = useSelector(selectHW);
  const { deviceId, model, brand, status } = hwDetails || {};

  return {
    deviceId,
    model,
    brand,
    status,
  };
};

export default useHWStatus;
