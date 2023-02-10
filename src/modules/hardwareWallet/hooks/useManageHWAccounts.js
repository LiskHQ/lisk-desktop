import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cryptography } from '@liskhq/lisk-client';
import HWManager from '@hardwareWallet/manager/HWManager';
import { selectSettings } from 'src/redux/selectors';
import { storeAccounts, removeAccounts } from '@hardwareWallet/store/actions/actions';
import useCheckInitializedAccount from '@common/hooks/useCheckInitializedAccount';

const getNameFromAccount = (address, settings) => {
  const { hardwareAccounts } = settings;
  const { deviceId } = HWManager.getActiveDeviceInfo();
  if (Array.isArray(hardwareAccounts[deviceId])) {
    const storedAccount = hardwareAccounts[deviceId].filter(
      (account) => account.address === address
    );
    return storedAccount.length ? storedAccount[0].name : null;
  }
  return null;
};

const useManageHWAccounts = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const deviceInfo = HWManager.getActiveDeviceInfo();

  async function getAccounts() {
    const accounts = [];
    let accountIndex = 0;
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const pubkey = await HWManager.getPublicKey(accountIndex);
      // try {
      const address = cryptography.address.getAddressFromPublicKey(Buffer.from(pubkey, 'hex'));
      // eslint-disable-next-line no-await-in-loop
      const isInitialized = await useCheckInitializedAccount(address);
      if (!isInitialized) break;
      accounts.push({
        hw: deviceInfo,
        metadata: {
          address,
          pubkey,
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
  getAccounts().then((accList) => {
    dispatch(storeAccounts(accList));
  });
  useEffect(() => {
    if (deviceInfo.currentDeviceStatus === 'disconnected') {
      dispatch(removeAccounts());
    }
  }, [deviceInfo.currentDeviceStatus]);
};

export default useManageHWAccounts;
