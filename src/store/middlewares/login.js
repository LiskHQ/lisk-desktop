import i18next from 'i18next';
import { getAccount, extractAddress, extractPublicKey } from '../../utils/api/account';
import { getDelegate } from '../../utils/api/delegate';
import { accountLoggedIn, accountLoading } from '../../actions/account';
import actionTypes from '../../constants/actions';
import accountConfig from '../../constants/account';
import { errorToastDisplayed } from '../../actions/toaster';

const { lockDuration } = accountConfig;
const loginMiddleware = store => next => (action) => {
  if (action.type !== actionTypes.activePeerSet || action.data.noSavedAccounts) {
    return next(action);
  }

  next(Object.assign({}, action, { data: action.data.activePeer }));

  const { passphrase, activePeer: { options: { code } } } = action.data;
  const publicKey = passphrase ? extractPublicKey(passphrase) : action.data.publicKey;
  const address = extractAddress(publicKey);
  const accountBasics = {
    passphrase,
    publicKey,
    address,
    network: code,
  };
  const { activePeer } = action.data;

  store.dispatch(accountLoading());

  // redirect to main/transactions
  return getAccount(activePeer, address).then((accountData) => {
    const duration = (passphrase && store.getState().settings.autoLog) ?
      Date.now() + lockDuration : 0;
    return getDelegate(activePeer, { publicKey })
      .then((delegateData) => {
        store.dispatch(accountLoggedIn({
          ...accountData,
          ...accountBasics,
          ...{ delegate: delegateData.delegate, isDelegate: true, expireTime: duration },
        }));
      }).catch(() => {
        store.dispatch(accountLoggedIn({
          ...accountData,
          ...accountBasics,
          ...{ delegate: {}, isDelegate: false, expireTime: duration },
        }));
      });
  }).catch(() => store.dispatch(errorToastDisplayed({ label: i18next.t('Unable to connect to the node') })));
};

export default loginMiddleware;
