// import { getIndexOfSavedAccount } from '../../utils/savedAccounts';
import actionTypes from '../../constants/actions';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const savedAccounts = (state = { accounts: [] }, action) => {
  const accounts = [...state.accounts];
  let indexOfAccount;
  let changedAccount;

  switch (action.type) {
    case actionTypes.accountsRetrieved:
      return action.data;
    case actionTypes.accountSaved:
      indexOfAccount = 0;// getIndexOfSavedAccount(state.accounts, action.data);
      changedAccount = action.data;
      if (indexOfAccount !== -1) {
        changedAccount = {
          ...accounts[indexOfAccount],
          balance: action.data.balance,
          passphrase: action.data.passphrase ?
            action.data.passphrase :
            accounts[indexOfAccount].passphrase,
          publicKey: action.data.publicKey,
        };
        accounts[indexOfAccount] = changedAccount;
      } else {
        accounts.push(action.data);
      }
      return {
        accounts,
        lastActive: changedAccount,
      };
    case actionTypes.passphraseUsed:
      indexOfAccount = 0;// getIndexOfSavedAccount(state.accounts, state.lastActive);
      accounts[indexOfAccount] = {
        ...accounts[indexOfAccount],
        passphrase: action.data,
      };
      return {
        accounts,
        lastActive: {
          ...state.lastActive,
          passphrase: action.data,
        },
      };
    case actionTypes.accountSwitched:
      return {
        ...state,
        lastActive: action.data,
      };
    case actionTypes.accountRemoved:
      return {
        ...state,
        accounts: state.accounts.filter(account =>
          !(account.publicKey === action.data.publicKey &&
          account.network === action.data.network)),
      };
    case actionTypes.removeSavedAccountPassphrase:
      return {
        ...state,
        accounts: state.accounts.map((account) => {
          if (!action.data || (`${action.data.network}${action.data.passphrase}` === `${account.network}${account.passphrase}`)) {
            delete account.passphrase;
          }
          return account;
        }),
      };
    default:
      return state;
  }
};

export default savedAccounts;
