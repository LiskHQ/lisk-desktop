import React from 'react';
import { toast } from 'react-toastify';
import { subscribeToDeviceConnected, subscribeToDeviceDisconnected } from '@wallet/utils/hwManager';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import history from 'src/utils/history';
import actionTypes from 'src/modules/common/store/actionTypes';
import i18n from 'i18next';
import DialogLink from '@theme/dialog/link';

const hwWalletMiddleware = store => next => (action) => {
  const { ipc } = window;

  if (action.type === actionTypes.storeCreated && ipc) {
    // autoLogInIfNecessary(store);

    /**
     * subscribeToDeviceConnected - Function -> To detect any new hw wallet device connection
     * @param {fn} function - callback function to execute toast dispatch after receive the data
     */
    subscribeToDeviceConnected((response) => {
      toast.success(`${response.model} connected`);
      const { devices, model } = response;

      toast.success(`${model} connected`);

      if (devices?.length > 1) {
        toast.info(
          <DialogLink component="selectHardwareDeviceModal">
            {i18n.t('Click here to select a hardware wallet')}
          </DialogLink>
        );
      }
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
