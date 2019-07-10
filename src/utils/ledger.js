import { getHWAccountInfo } from './api/hwWallet';
import { loginType as loginTypesConst } from '../constants/hwConstants';

/* eslint-disable no-await-in-loop */
/* eslint-disable-next-line */
export const displayAccounts = async ({ liskAPIClient, loginType, hwAccounts, t, unInitializedAdded = false, device }) => { // eslint-disable-line
  let index = unInitializedAdded ? hwAccounts.length : 0;
  let accountInfo;
  const deviceId = device && device.deviceId;
  const deviceModel = device && device.model;

  const accounts = [];
  do {
    try {
      switch (loginType) { // eslint-disable-line
        case loginTypesConst.ledger:
          // eslint-disable-next-line
          accountInfo = await getHWAccountInfo(liskAPIClient, deviceId, loginTypesConst.ledger, index);
          break;
        case loginTypesConst.trezor:
          // eslint-disable-next-line
          accountInfo = await getHWAccountInfo(liskAPIClient, deviceId, loginTypesConst.trezor, index);
          break;
        default:
          this.props.errorToastDisplayed({
            text: this.props.t('Login Type not recognized.'),
          });
      }
    } catch (error) {
      return;
    }
    if ((!unInitializedAdded && (index === 0 || accountInfo.isInitialized))
      || (unInitializedAdded && !accountInfo.isInitialized)) {
      accounts.push(accountInfo);
    }
    index++;
  }
  while (accountInfo.isInitialized || index === 0);
  /* eslint-disable-next-line */
  return {
    deviceModel,
    deviceId,
    hwAccounts: accounts,
    isLoading: false,
    showNextAvailable: (index === 1),
  };
};
