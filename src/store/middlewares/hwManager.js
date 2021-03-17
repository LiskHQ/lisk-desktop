// istanbul ignore file
import { toast } from 'react-toastify';
import { subscribeToDeviceConnected, subscribeToDeviceDisconnected } from '@utils/hwManager';
import { actionTypes } from '@constants';
import { addSearchParamsToUrl } from '@utils/searchParams';
import { accountLoggedOut, login } from '@actions';
import {
  getDeviceList,
  getPublicKey,
} from '../../../libs/hwManager/communication';
import history from '../../history';

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
      const { account, settings } = store.getState();
      const activeToken = settings.token.active || 'LSK';

      // Check if user is SignedIn
      if (account.info
        && account.info[activeToken]
        && account.info[activeToken].address
        && account.hwInfo.deviceId
        && account.hwInfo.deviceModel === response.model
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
