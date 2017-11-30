import i18next from 'i18next';
import { accountSaved } from '../../actions/savedAccounts';
import { getAccount, extractAddress, extractPublicKey } from '../../utils/api/account';
import { getDelegate } from '../../utils/api/delegate';
import { getIndexOfSavedAccount } from '../../utils/savedAccounts';
import { accountLoggedIn } from '../../actions/account';
import actionTypes from '../../constants/actions';
import { errorToastDisplayed } from '../../actions/toaster';

const loginMiddleware = store => next => (action) => {
  if (action.type !== actionTypes.activePeerSet) {
    return next(action);
  }

  next(Object.assign({}, action, { data: action.data.activePeer }));

  const { passphrase } = action.data;
  const publicKey = passphrase ? extractPublicKey(passphrase) : action.data.publicKey;
  const address = extractAddress(publicKey);
  const accountBasics = {
    passphrase,
    publicKey,
    address,
  };
  const { activePeer } = action.data;

  // redirect to main/transactions
  return getAccount(activePeer, address).then((accountData) => {
    getDelegate(activePeer, { publicKey })
      .then((delegateData) => {
        store.dispatch(accountLoggedIn({
          ...accountData,
          ...accountBasics,
          ...{ delegate: delegateData.delegate, isDelegate: true },
        }));
      }).catch(() => {
        store.dispatch(accountLoggedIn({
          ...accountData,
          ...accountBasics,
          ...{ delegate: {}, isDelegate: false },
        }));
      });
    const networkOptions = store.getState().peers.options;
    const accountToSave = {
      balance: accountData.balance,
      publicKey: accountBasics.publicKey,
      network: networkOptions.code,
      address: networkOptions.address,
    };
    if (getIndexOfSavedAccount(accountToSave) === -1) {
      store.dispatch(accountSaved(accountToSave));
    }
  }).catch(() => store.dispatch(errorToastDisplayed({ label: i18next.t('Unable to connect to the node') })));
};

export default loginMiddleware;
