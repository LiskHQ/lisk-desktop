import { toast } from 'react-toastify';
import { subscribeToDeviceConnected, subscribeToDeviceDisconnected } from '@wallet/utils/hwManager';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { accountLoggedOut, login } from '@auth/store/action';
import {
  getDeviceList,
  getPublicKey,
} from '@libs/hwManager/communication';
import history from 'src/utils/history';
import actionTypes from '../actions/actionTypes';

async function autoLogInIfNecessary(store) {
  // not tested as it is just a development helper
  // istanbul ignore next
  if (localStorage.getItem('hwWalletAutoLogin')) {
    const device = (await getDeviceList())[0];
    if (device) {
      const index = 0;
      const publicKey = await getPublicKey({ index, deviceId: device.deviceId });
      const hwInfo = {
        derivationIndex: index,
        deviceId: device.deviceId,
        deviceModel: device.model,
      };
      setTimeout(() => {
        store.dispatch(login({ hwInfo, publicKey }));
      }, 1000);
    }
  }
}

const hwWalletMiddleware = store => next => (action) => {
  const { ipc } = window;

  if (action.type === actionTypes.storeCreated && ipc) {
    autoLogInIfNecessary(store);

    /**
     * subscribeToDeviceConnected - Function -> To detect any new hw wallet device connection
     * @param {fn} function - callback function to execute toast dispatch after receive the data
     */
    subscribeToDeviceConnected((response) => {
      toast.success(`${response.model} connected`);
    });

    /**
     * subscribeToDeviceDisconnected - Function -> To detect any hw wallet disconnection
     * @param {fn} function - callback function to execute toast dispatch after receive the data
     * and in case user is SignIn trigger the logout Dialog and toast message.
     */
    subscribeToDeviceDisconnected((response) => {
      const { wallet, token } = store.getState();
      const activeToken = token.active || 'LSK';

      // Check if user is SignedIn
      if (wallet.info
        && wallet.info[activeToken]
        && wallet.info[activeToken].address
        && wallet.hwInfo.deviceId
        && wallet.hwInfo.deviceModel === response.model
      ) {
        addSearchParamsToUrl(history, { modal: 'deviceDisconnectDialog', model: response.model });
        store.dispatch(accountLoggedOut());
      }

      toast.error(`${response.model} disconnected`);
    });
  }

  next(action);
};

export default hwWalletMiddleware;
