// istanbul ignore file
import actionTypes from '../../constants/actions';
import { accountLoggedOut } from '../../actions/account';
import { dialogDisplayed, dialogHidden } from '../../actions/dialog';
import { updateDeviceList } from '../../actions/hwWallets';
import { successToastDisplayed, errorToastDisplayed, infoToastDisplayed } from '../../actions/toaster';
import { HW_MSG } from '../../constants/hwConstants';
import Alert from '../../components/dialog/alert';

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
      const { account } = state;

      if (account.address) {
        if (account.hwInfo && account.hwInfo.deviceId) {
          store.dispatch(dialogDisplayed({
            childComponent: Alert,
            childComponentProps: {
              title: 'You are disconnected',
              text: `There is no connection to the ${model}. Please check the cables if it happened by accident.`,
              closeDialog: () => {
                store.dispatch(dialogHidden());
                location.reload(); // eslint-disable-line
              },
            },
          }));
          store.dispatch(accountLoggedOut());
        }
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
