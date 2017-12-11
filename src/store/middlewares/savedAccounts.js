import actionTypes from '../../constants/actions';
import { accountLoggedOut } from '../../actions/account';
import { accountSaved } from '../../actions/savedAccounts';
import { activePeerSet } from '../../actions/peers';
import { getIndexOfSavedAccount } from '../../utils/savedAccounts';
import getNetwork from '../../utils/getNetwork';

const savedAccountsMiddleware = store => next => (action) => {
  next(action);
  const { peers, savedAccounts, account } = store.getState();
  let accountToSave;
  switch (action.type) {
    case actionTypes.accountSwitched:
      store.dispatch(accountLoggedOut());
      store.dispatch(activePeerSet({
        publicKey: action.data.publicKey,
        network: {
          ...getNetwork(action.data.network),
          address: action.data.address,
        },
      }));
      break;
    case actionTypes.activeAccountSaved:
      accountToSave = {
        balance: account.balance,
        publicKey: account.publicKey,
        network: peers.options.code,
        address: peers.options.address,
      };
      if (getIndexOfSavedAccount(savedAccounts.accounts, accountToSave) === -1) {
        store.dispatch(accountSaved(accountToSave));
      }
      break;
    case actionTypes.accountLoggedIn:
      accountToSave = {
        balance: action.data.balance,
        publicKey: action.data.publicKey,
        network: peers.options.code,
        address: peers.options.address,
      };
      if (getIndexOfSavedAccount(savedAccounts.accounts, accountToSave) === -1) {
        store.dispatch(accountSaved(accountToSave));
      }
      break;
    default:
      break;
  }
};

export default savedAccountsMiddleware;
