import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cryptography } from '@liskhq/lisk-client';
import HWManager from '@hardwareWallet/manager/HWManager';
import { selectSettings } from 'src/redux/selectors';
import { storeAccounts, removeAccounts } from '@hardwareWallet/store/actions/actions';
import useCheckInitializedAccount from '@common/hooks/useCheckInitializedAccount';

const getNameFromAccount = (address, settings) => {
  const { hardwareAccounts } = settings;
  const { deviceId } = HWManager.getDeviceInfo();
  if (Array.isArray(hardwareAccounts[deviceId])) {
    const storedAccount = hardwareAccounts[deviceId].filter(
      (account) => account.address === address
    );
    return storedAccount.length ? storedAccount[0].name : null;
  }
  return null;
};

const useManageHWAccounts = async () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const deviceInfo = HWManager.getCurrentDeviceInfo();

  async function getAccounts() {
    const accounts = [];
    let accountIndex = 0;
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const pubKey = await HWManager.getPublicKey(accountIndex);
      const address = cryptography.address.getAddressFromPublicKey(pubKey);
      // eslint-disable-next-line no-await-in-loop
      const isInitialized = await useCheckInitializedAccount(address);
      if (!isInitialized) break;
      accounts.push({
        hw: deviceInfo,
        metadata: {
          address,
          pubKey,
          accountIndex,
          name: getNameFromAccount(address, settings),
          path: '',
          isHW: true,
          creationTime: new Date().toISOString(),
        },
      });
      ++accountIndex;
    }
    return accounts;
  }
  const accountsList = await getAccounts();
  dispatch(storeAccounts(accountsList));

  useEffect(() => {
    if (deviceInfo.currentDeviceStatus === 'disconnected') {
      dispatch(removeAccounts());
    }
  }, [deviceInfo.currentDeviceStatus]);
};

export default useManageHWAccounts;
