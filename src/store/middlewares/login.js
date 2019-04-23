import actionTypes from '../../constants/actions';
import { accountLoggedOut } from '../../actions/account';
import { dialogDisplayed, dialogHidden } from '../../actions/dialog';
import { errorToastDisplayed } from '../../actions/toaster';
import Alert from '../../components/dialog/alert';

const loginMiddleware = store => next => (action) => {
  const { ipc } = window;
  switch (action.type) {
    case actionTypes.storeCreated:
      if (ipc) { // On browser-mode is undefined
        store.dispatch({
          type: actionTypes.settingsUpdated,
          data: { isHarwareWalletConnected: false },
        });

        ipc.on('hwConnected', (event, { model }) => {
          store.dispatch({
            type: actionTypes.settingsUpdated,
            data: { isHarwareWalletConnected: true },
          });
          store.dispatch(errorToastDisplayed({ label: `${model} connected` }));
        });

        ipc.on('hwDisconnected', (event, { model }) => {
          const state = store.getState();
          const { account } = state;
          if (account.address) {
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
