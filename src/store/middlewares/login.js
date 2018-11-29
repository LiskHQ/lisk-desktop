import i18next from 'i18next';
import { getAccount } from '../../utils/api/account';
import { extractAddress, extractPublicKey } from '../../utils/account';
import { LEDGER_MSG } from '../../utils/ledger';
import { accountLoggedIn, accountLoading, accountLoggedOut } from '../../actions/account';
import actionTypes from '../../constants/actions';
import accountConfig from '../../constants/account';
import { loginType } from '../../constants/hwConstants';
import { errorToastDisplayed } from '../../actions/toaster';
import { dialogDisplayed, dialogHidden } from '../../actions/dialog';
import Alert from '../../components/dialog/alert';

const { lockDuration } = accountConfig;
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
      // store.dispatch(errorToastDisplayed({ label: LEDGER_MSG.LEDGER_DISCONNECTED }));
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
    if (action.type !== actionTypes.liskAPIClientSet ||
        (!action.data.publicKey && !action.data.passphrase)) {
      return next(action);
    }
    if (action.type === actionTypes.liskAPIClientSet &&
      action.data.loginType === loginType.ledger) {
      return next(action);
    }
    next(action);

    const { passphrase, liskAPIClient, options } = action.data;
    const publicKey = passphrase ? extractPublicKey(passphrase) : action.data.publicKey;
    const address = extractAddress(publicKey);
    const accountBasics = {
      passphrase,
      publicKey,
      address,
      network: options.code,
      peerAddress: options.address,
    };

    store.dispatch(accountLoading());

    // redirect to main/transactions
    return getAccount(liskAPIClient, address).then((accountData) => {
      const duration = (passphrase && store.getState().settings.autoLog) ?
        Date.now() + lockDuration : 0;
      const accountUpdated = {
        ...accountData,
        ...accountBasics,
        expireTime: duration,
      };
      store.dispatch(accountLoggedIn(accountUpdated));
    }).catch(() => {
      store.dispatch(errorToastDisplayed({ label: i18next.t('Unable to connect to the node') }));
      store.dispatch(accountLoggedOut());
    });
  };
};

export default loginMiddleware;
