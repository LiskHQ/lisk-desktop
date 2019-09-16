// istanbul ignore file
import React from 'react';
import i18n from '../../i18n';
import actionTypes from '../../constants/actions';
import { accountLoggedOut } from '../../actions/account';
import { updateDeviceList } from '../../actions/hwWallets';
import { successToastDisplayed } from '../../actions/toaster';
import Dialog from '../../components/toolbox/dialog/dialog';
import DialogHolder from '../../components/toolbox/dialog/holder';
import { PrimaryButton } from '../../components/toolbox/buttons/button';
import { subscribeToDeviceConnceted, subscribeToDeviceDisonnceted } from '../../utils/hwManager';

/**
 * TODO this can move later to a different file in case we need.
 * deviceDisconnectDialog - Function - Renders the dialog when user is SignedIn and remove
 * hw device connection, the dialog will logout the session.
 * @param {string} model - HW Device model
 */
const deviceDisconnectDialog = model => DialogHolder.showDialog(
  <Dialog>
    <Dialog.Title>{i18n.t('You are disconnected')}</Dialog.Title>
    <Dialog.Description>
      {i18n.t('There is no connection to the {{model}}. Please check the cables if it happened by accident.', { model })}
    </Dialog.Description>
    <Dialog.Options align="center">
      <PrimaryButton>
        {i18n.t('Ok')}
      </PrimaryButton>
    </Dialog.Options>
  </Dialog>,
);

const hwWalletMiddleware = store => next => (action) => {
  const { ipc } = window;

  if (action.type === actionTypes.storeCreated && ipc) {
    // Set at first the isHarwareWalletConnected property to false.
    store.dispatch({
      type: actionTypes.settingsUpdated,
      data: { isHarwareWalletConnected: false },
    });

    ipc.on('hwDeviceListChanged', (event, devicesList) => {
      store.dispatch(updateDeviceList(devicesList));
    });

    /**
     * subscribeToDeviceConnceted - Function -> To detect any new hw wallet device connection
     * @param {fn} function - callback function to execute toast dispatch after receive the data
     */
    subscribeToDeviceConnceted((response) => {
      store.dispatch(successToastDisplayed({ label: `${response.model} connected` }));
      store.dispatch({
        type: actionTypes.settingsUpdated,
        data: { isHarwareWalletConnected: true },
      });
    });

    /**
     * subscribeToDeviceDisonnceted - Function -> To detect any hw wallet disconnection
     * @param {fn} function - callback function to execute toast dispatch after receive the data
     * and in case user is SignIn trigger the logout Dialog and toast message.
     */
    subscribeToDeviceDisonnceted((response) => {
      const { account, settings, hwWallets } = store.getState();
      const activeToken = settings.token.active || 'LSK';

      // Check if user is SignedIns
      if (account.info
        && account.info[activeToken]
        && account.info[activeToken].address
        && account.hwInfo.deviceId
        && account.hwInfo.deviceModel === response.model
      ) {
        deviceDisconnectDialog(response.model);
        store.dispatch(accountLoggedOut());
      }

      store.dispatch({
        type: actionTypes.settingsUpdated,
        data: { isHarwareWalletConnected: !!hwWallets.devices.length },
      });

      store.dispatch(successToastDisplayed({ label: `${response.model} disconnected` }));
    });
  }

  next(action);
};

export default hwWalletMiddleware;
