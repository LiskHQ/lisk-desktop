import actionTypes from '../../constants/actions';
import { accountLoggedOut } from '../../actions/account';
import { accountsRetrieved, accountSaved } from '../../actions/savedAccounts';
import { activePeerSet } from '../../actions/peers';
import getNetwork from '../../utils/getNetwork';

const savedAccountsMiddleware = (store) => {
  store.dispatch(accountsRetrieved());
  return next => (action) => {
    next(action);
    const { peers, account } = store.getState();
    switch (action.type) {
      case actionTypes.accountSwitched:
        store.dispatch(accountLoggedOut());
        store.dispatch(activePeerSet({
          publicKey: action.data.publicKey,
          passphrase: action.data.passphrase,
          network: {
            ...getNetwork(action.data.network),
            address: action.data.address,
          },
        }));
        break;
      case actionTypes.activeAccountSaved:
        store.dispatch(accountSaved({
          balance: account.balance,
          publicKey: account.publicKey,
          network: peers.options.code,
          address: peers.options.address,
        }));
        break;
      case actionTypes.accountLoggedIn:
        store.dispatch(accountSaved({
          passphrase: action.data.passphrase,
          balance: action.data.balance,
          publicKey: action.data.publicKey,
          network: peers.options.code,
          address: peers.options.address,
        }));
        break;
      default:
        break;
    }
  };
};

export default savedAccountsMiddleware;
