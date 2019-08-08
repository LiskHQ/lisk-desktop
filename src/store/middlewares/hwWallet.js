// istanbul ignore file
import React from 'react';
import i18n from '../../i18n';
import actionTypes from '../../constants/actions';
import { accountLoggedOut } from '../../actions/account';
import { updateDeviceList } from '../../actions/hwWallets';
import { successToastDisplayed, errorToastDisplayed, infoToastDisplayed } from '../../actions/toaster';
import { HW_MSG } from '../../constants/hwConstants';
import Dialog from '../../components/toolbox/dialog/dialog';
import DialogHolder from '../../components/toolbox/dialog/holder';
import { PrimaryButton } from '../../components/toolbox/buttons/button';

// eslint-disable-next-line max-statements
const hwWalletMiddleware = store => next => (action) => {
  const { ipc } = window;

  if (action.type === actionTypes.storeCreated && ipc) {
    const util = require('util');

    store.dispatch({
      type: actionTypes.settingsUpdated,
      data: { isHarwareWalletConnected: false },
    });

    ipc.on('hwDeviceListChanged', (event, devicesList) => {
      store.dispatch(updateDeviceList(devicesList));
    });

    ipc.on('hwConnected', (event, { model }) => {
      store.dispatch({
        type: actionTypes.settingsUpdated,
        data: { isHarwareWalletConnected: true },
      });

      store.dispatch(successToastDisplayed({ label: `${model} connected` }));
    });

    ipc.on('hwDisconnected', (event, { model }) => {
      const state = store.getState();
      const { account, settings } = state;
      const activeToken = settings.token.active || 'LSK';

      if (account.info[activeToken].address
        && account.hwInfo
        && account.hwInfo.deviceId
        && account.hwInfo.deviceModel === model
      ) {
        DialogHolder.showDialog(
          <Dialog>
            <Dialog.Title>{i18n.t('You are disconnected')}</Dialog.Title>
            <Dialog.Description>
              <p>{i18n.t('There is no connection to the {{model}}. Please check the cables if it happened by accident.', { model })}</p>
            </Dialog.Description>
            <Dialog.Options align="center">
              <PrimaryButton>
                {i18n.t('Ok')}
              </PrimaryButton>
            </Dialog.Options>
          </Dialog>,
        );

        store.dispatch(accountLoggedOut());
      }

      store.dispatch({
        type: actionTypes.settingsUpdated,
        data: { isHarwareWalletConnected: !!state.hwWallets.devices.length },
      });

      store.dispatch(successToastDisplayed({ label: `${model} disconnected` }));
    });

    ipc.on('trezorButtonCallback', (event, data) => {
      store.dispatch(infoToastDisplayed({
        label: util.format(HW_MSG.TREZOR_ASK_FOR_CONFIRMATION, data),
      }));
    });

    ipc.on('trezorParamMessage', (event, data) => {
      store.dispatch(infoToastDisplayed({ label: HW_MSG[data] }));
    });

    ipc.on('trezorError', () => {
      store.dispatch(errorToastDisplayed({ label: HW_MSG.ERROR_OR_DEVICE_IS_NOT_CONNECTED }));
    });
  }

  next(action);
};

export default hwWalletMiddleware;
