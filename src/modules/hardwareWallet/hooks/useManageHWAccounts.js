import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSettings, selectHW } from 'src/redux/selectors';
import { storeHWAccounts, removeHWAccounts } from '@hardwareWallet/store/actions/actions';
import { getNameFromAccount } from '../utils/getNameFromAccount';
import { getHWAccounts } from '../utils/getHWAccounts';

const useManageHWAccounts = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const [prevDeviceId, setCurrentDeviceId] = useState();
  const { deviceId, status } = useSelector(selectHW);

  const addAccounts = () => {
    if (prevDeviceId === deviceId || status !== 'connected') {
      return;
    }
    setCurrentDeviceId(deviceId);
    getHWAccounts(getNameFromAccount, settings, deviceId)
      .then((accList) => {
        dispatch(storeHWAccounts(accList));
      })
      .catch((err) => console.log({ err }));
  };

  useEffect(() => {
    addAccounts();
    if (status === 'disconnected') {
      dispatch(removeHWAccounts());
    }
  }, [status, deviceId]);
};

export default useManageHWAccounts;
