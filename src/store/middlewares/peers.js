import { activePeerSet, activePeerUpdate } from '../../actions/peers';
import actionTypes from '../../constants/actions';
import networks from './../../constants/networks';
import getNetwork from './../../utils/getNetwork';
import { shouldAutoLogIn, getAutoLogInData, findMatchingLoginNetwork } from './../../utils/login';

const peersMiddleware = store => next => (action) => {
  next(action);

  const autologinData = getAutoLogInData();
  const { liskCoreUrl } = autologinData;

  let loginNetwork = findMatchingLoginNetwork();

  // if cant find login network but liskCoreUrl is set then is custom node
  // else default network
  if (loginNetwork) {
    loginNetwork = loginNetwork.slice(-1).shift();
  } else if (!loginNetwork) {
    loginNetwork = liskCoreUrl ? networks.customNode : networks.default;
  }

  const network = Object.assign({}, getNetwork(loginNetwork.code));

  switch (action.type) {
    case actionTypes.storeCreated:
      // It stops liskAPIClient to be overridden to mainnet
      // when we want to autologin for explorer account
      // https://github.com/LiskHQ/lisk-hub/issues/1339
      /* istanbul ignore else */
      if (!shouldAutoLogIn(autologinData)) {
        store.dispatch(activePeerSet({ network }));
      }
      store.dispatch(activePeerUpdate({ online: true }));
      break;
    default: break;
  }
};

export default peersMiddleware;
