import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSettings, selectHWStatus } from 'src/redux/selectors';
import { storeAccounts, removeAccounts } from '@hardwareWallet/store/actions/actions';
import { getHWAccounts } from '../utils/getHWAccounts';


const useManageHWAccounts = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const [prevDeviceId, setCurrentDeviceId] = useState();
   const { deviceId, status } = useSelector(selectHWStatus);

  const getNameFromAccount = (address) => {
    const { hardwareAccounts } = settings;

    if (Array.isArray(hardwareAccounts[deviceId])) {
      const storedAccount = hardwareAccounts[deviceId].filter(
        (account) => account.address === address
      );
      return storedAccount.length ? storedAccount[0].name : null;
    }
    return null;
  };

  const addAccounts = () => {
    if(prevDeviceId === deviceId || status !== 'connected') {
      return
    }
    setCurrentDeviceId(deviceId)
    getHWAccounts(getNameFromAccount).then((accList) => {
      dispatch(storeAccounts(accList));
    });
  }

  useEffect(() => {
    addAccounts()
    if (status === 'disconnected') {
      dispatch(removeAccounts());
    }
  }, [status, deviceId]);
};

export default useManageHWAccounts;
