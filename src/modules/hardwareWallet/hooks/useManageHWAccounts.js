import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSettings } from 'src/redux/selectors';
import { setHWAccounts, removeHWAccounts } from '@hardwareWallet/store/actions';
import { useHWStatus } from '@hardwareWallet/hooks/useHWStatus';
import { getNameFromAccount } from '../utils/getNameFromAccount';
import { getHWAccounts } from '../utils/getHWAccounts';

const useManageHWAccounts = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const [prevDevicePath, setCurrentDevicePath] = useState();
  const device = useHWStatus();
  const { path, status } = device;
  const getName = (address, model) => getNameFromAccount(address, settings, model)
  const addAccounts = () => {
    if (prevDevicePath === path || status !== 'connected') {
      return;
    }
    setCurrentDevicePath(path);
    getHWAccounts({
      getName,
      device,
    })
      .then((accList) => {
        dispatch(setHWAccounts(accList));
      })
      .catch((err) => console.log({ err }));
  };

  useEffect(() => {
    addAccounts();
    if (status === 'disconnected') {
      dispatch(removeHWAccounts());
    }
  }, [status, path]);
};

export default useManageHWAccounts;
