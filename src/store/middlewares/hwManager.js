// istanbul ignore file
import React from 'react';
import { toast } from 'react-toastify';
import { PrimaryButton } from '../../components/toolbox/buttons/button';
import { accountLoggedOut, login } from '../../actions/account';
import {
  getDeviceList,
  getPublicKey,
} from '../../../libs/hwManager/communication';
import { subscribeToDeviceConnceted, subscribeToDeviceDisonnceted } from '../../utils/hwManager';
import Dialog from '../../components/toolbox/dialog/dialog';
import DialogHolder from '../../components/toolbox/dialog/holder';
import actionTypes from '../../constants/actions';
import i18n from '../../i18n';

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
     * subscribeToDeviceConnceted - Function -> To detect any new hw wallet device connection
     * @param {fn} function - callback function to execute toast dispatch after receive the data
     */
    subscribeToDeviceConnceted((response) => {
      toast.success(`${response.model} connected`);
    });

    /**
     * subscribeToDeviceDisonnceted - Function -> To detect any hw wallet disconnection
     * @param {fn} function - callback function to execute toast dispatch after receive the data
     * and in case user is SignIn trigger the logout Dialog and toast message.
     */
    subscribeToDeviceDisonnceted((response) => {
      const { account, settings } = store.getState();
      const activeToken = settings.token.active || 'LSK';

      // Check if user is SignedIn
      if (account.info
        && account.info[activeToken]
        && account.info[activeToken].address
        && account.hwInfo.deviceId
        && account.hwInfo.deviceModel === response.model
      ) {
        deviceDisconnectDialog(response.model);
        store.dispatch(accountLoggedOut());
      }

      toast.error(`${response.model} disconnected`);
    });
  }

  next(action);
};

export default hwWalletMiddleware;
