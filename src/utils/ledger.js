/* eslint-disable */
import { isBrowser } from 'browser-or-node';
import isElectron from 'is-electron';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import i18next from 'i18next';
import { LedgerAccount, SupportedCoin, DposLedger } from 'dpos-ledger-api';
import { hwConstants, LEDGER_COMMANDS, loginType as loginTypesConst } from '../constants/hwConstants';
// import { loadingStarted, loadingFinished } from './loading';
// import signPrefix from '../constants/signPrefix';
import { getLedgerAccountInfo } from './api/ledger';
import { getHWAccountInfo } from './api/hwWallet';
import { getBufferToHex, getTransactionBytes, calculateTxId } from './rawTransactionWrapper';

/* eslint-disable no-await-in-loop */
export const displayAccounts = async ({ liskAPIClient, loginType, hwAccounts, t, unInitializedAdded = false, device }) => { // eslint-disable-line
  let index = unInitializedAdded ? hwAccounts.length : 0;
  let accountInfo;
  const deviceId = device.deviceId;

  const accounts = [];
  do {
    try {
      switch (loginType) { // eslint-disable-line
        case loginTypesConst.ledger:
          accountInfo = await getHWAccountInfo(liskAPIClient, deviceId, loginTypesConst.ledger, index);
          break;
        case loginTypesConst.trezor:
          accountInfo = await getHWAccountInfo(liskAPIClient, deviceId, loginTypesConst.trezor, index);
          break;
        default:
          this.props.errorToastDisplayed({
          text: this.props.t('Login Type not recognized.')
        });
      }
    } catch (error) {
      return;
    }
    if ((!unInitializedAdded && (index === 0 || accountInfo.isInitialized)) ||
      (unInitializedAdded && !accountInfo.isInitialized)) {
      accounts.push(accountInfo);
    }
    index++;
  }
  while (accountInfo.isInitialized || index === 0);
  /* eslint-disable-next-line */
  return {
    hwAccounts: accounts,
    isLoading: false,
    showNextAvailable: (index === 1),
  };
};
