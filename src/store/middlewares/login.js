
import { LEDGER_MSG } from '../../utils/ledger';
import { accountLoggedOut } from '../../actions/account';
import actionTypes from '../../constants/actions';
import { errorToastDisplayed } from '../../actions/toaster';
import { dialogDisplayed, dialogHidden } from '../../actions/dialog';
import Alert from '../../components/dialog/alert';

const loginMiddleware = (store) => {
  const { ipc } = window;

  if (ipc) { // On browser-mode is undefined
    ipc.on('ledgerConnected', () => {
      store.dispatch({
        type: actionTypes.settingsUpdated,
        data: { isHarwareWalletConnected: true },
      });
      store.dispatch(errorToastDisplayed({ label: LEDGER_MSG.LEDGER_CONNECTED }));
    });
    ipc.on('ledgerDisconnected', () => {
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
      store.dispatch({
        type: actionTypes.settingsUpdated,
        data: { isHarwareWalletConnected: false },
      });
      store.dispatch(accountLoggedOut());
    });
  }
  return next => (action) => { // eslint-disable-line max-statements
    next(action);
  };
};

export default loginMiddleware;
