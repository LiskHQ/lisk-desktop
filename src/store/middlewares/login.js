import i18next from 'i18next';
import { getAccount } from '../../utils/api/account';
import { getAutoLogInData, shouldAutoLogIn } from '../../utils/login';
import { extractAddress, extractPublicKey } from '../../utils/account';
import { accountLoggedIn, accountLoading, accountLoggedOut } from '../../actions/account';
import { activePeerSet, activePeerUpdate } from '../../actions/peers';
import networks from '../../constants/networks';
import actionTypes from '../../constants/actions';
import accountConfig from '../../constants/account';
import settings from '../../constants/settings';
import { errorToastDisplayed } from '../../actions/toaster';

const { lockDuration } = accountConfig;
const autoLogInIfNecessary = (store) => {
  const autologinData = getAutoLogInData();
  if (shouldAutoLogIn(autologinData)) {
    store.dispatch(activePeerSet({
      passphrase: autologinData[settings.keys.autologinKey],
      network: { ...networks.customNode, address: autologinData[settings.keys.autologinUrl] },
    }));
    store.dispatch(activePeerUpdate({
      online: true,
    }));
  }
};

const loginMiddleware = store => next => (action) => {
  if (action.type !== actionTypes.activePeerSet ||
      (!action.data.publicKey && !action.data.passphrase)) {
    autoLogInIfNecessary();
    return next(action);
  }
  next(action);

  const { passphrase, activePeer, options } = action.data;
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
  return getAccount(activePeer, address).then((accountData) => {
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

export default loginMiddleware;
