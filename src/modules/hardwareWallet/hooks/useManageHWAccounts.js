import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSettings } from 'src/redux/selectors';
import { removeHWAccounts, setHWAccounts } from '@hardwareWallet/store/actions';
import { useHWStatus } from '@hardwareWallet/hooks/useHWStatus';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getNameFromAccount } from '../utils/getNameFromAccount';
import { getHWAccounts } from '../utils/getHWAccounts';

const useManageHWAccounts = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const settings = useSelector(selectSettings);
  const [prevDevicePath, setCurrentDevicePath] = useState();
  const device = useHWStatus();
  const { path, status } = device;
  /* istanbul ignore next */
  const getName = (address, model) => getNameFromAccount(address, settings, model);
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
      .catch(() => {
        dispatch(setHWAccounts([]));
        toast.error(t('Failed to add hardware wallet accounts'));
      });
  };

  useEffect(() => {
    if (status === 'disconnected') {
      dispatch(removeHWAccounts());
      return;
    }
    addAccounts();
  }, [status, path]);
};

export default useManageHWAccounts;
