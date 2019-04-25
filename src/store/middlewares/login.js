
import { accountLoggedOut } from '../../actions/account';
import actionTypes from '../../constants/actions';
import { HW_MSG } from '../../constants/hwConstants';
import { errorToastDisplayed } from '../../actions/toaster';
import { dialogDisplayed, dialogHidden } from '../../actions/dialog';
import Alert from '../../components/dialog/alert';

const loginMiddleware = store => next => (action) => { // eslint-disable-line max-statements
  const { ipc } = window;

  switch (action.type) {
    case actionTypes.storeCreated:
      if (ipc) { // On browser-mode is undefined
        store.dispatch({
          type: actionTypes.settingsUpdated,
          data: { isHarwareWalletConnected: false },
        });

        ipc.on('ledgerConnected', () => {
          store.dispatch({
            type: actionTypes.settingsUpdated,
            data: { isHarwareWalletConnected: true },
          });
          store.dispatch(errorToastDisplayed({ label: HW_MSG.LEDGER_CONNECTED }));
        });

        ipc.on('ledgerDisconnected', () => {
          const state = store.getState();
          const { account } = state;
          if (account.address) {
            store.dispatch( // eslint-disable-line
              dialogDisplayed({
                childComponent: Alert,
                childComponentProps: {
                  title: 'You are disconnected',
                  text: 'There is no connection to the Ledger Nano S. Please check the cables if it happened by accident.',
                  closeDialog: () => {
                    store.dispatch(dialogHidden());
                    location.reload(); // eslint-disable-line
                  },
                },
              }));
            store.dispatch(accountLoggedOut());
          }
          store.dispatch({
            type: actionTypes.settingsUpdated,
            data: { isHarwareWalletConnected: false },
          });
        });
      }
      break;
    default: break;
  }
  next(action);
};

export default loginMiddleware;
