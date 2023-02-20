import React from 'react';
import { toast } from 'react-toastify';
import { subscribeToDeviceConnected, subscribeToDeviceDisconnected } from '@wallet/utils/hwManager';
import DeviceToast from '@hardwareWallet/components/DeviceToast/DeviceToast';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import history from 'src/utils/history';
import actionTypes from 'src/modules/common/store/actionTypes';

const hwWalletMiddleware = store => next => (action) => {
  const { ipc } = window;

  if (action.type === actionTypes.storeCreated && ipc) {
    // autoLogInIfNecessary(store);

    /**
     * subscribeToDeviceConnected - Function -> To detect any new hw wallet device connection
     * @param {fn} function - callback function to execute toast dispatch after receive the data
     */
    subscribeToDeviceConnected((response) => {
      const { model, deviceLength } = response;
      const label = `${model} connected.`
      toast(<DeviceToast label={label} showSelectHardwareDeviceModalLink={deviceLength > 1} />);
    });

    /**
     * subscribeToDeviceDisconnected - Function -> To detect any hw wallet disconnection
     * @param {fn} function - callback function to execute toast dispatch after receive the data
     * and in case user is SignIn trigger the logout Dialog and toast message.
     */
    subscribeToDeviceDisconnected((response) => {
      const { wallet, token } = store.getState();
      const activeToken = token.active;

      // Check if user is SignedIn
      if (wallet.info
        && wallet.info[activeToken]
        && wallet.info[activeToken].address
        && wallet.hwInfo.deviceId
        && wallet.hwInfo.deviceModel === response.model
      ) {
        addSearchParamsToUrl(history, { modal: 'deviceDisconnectDialog', model: response.model });
        // store.dispatch(accountLoggedOut());
      }

      toast.error(`${response.model} disconnected`);
    });
  }

  next(action);
};

export default hwWalletMiddleware;
