import { activePeerSet, activePeerUpdate } from '../../actions/peers';
import actionTypes from '../../constants/actions';
import networks from './../../constants/networks';
import getNetwork from './../../utils/getNetwork';
import { shouldAutoLogIn, getAutoLogInData } from './../../utils/login';

const peersMiddleware = store => next => (action) => {
  next(action);

  const autologinData = getAutoLogInData();
  const { loginUrl } = autologinData;

  let loginNetwork = Object.entries(networks).find((network) => {
    const { nodes } = network.slice(-1).shift();
    return Array.isArray(nodes) ? nodes.includes(loginUrl) : false;
  });

  // if cant find login network but loginUrl is set then is custom node
  // else default network
  if (loginNetwork) {
    loginNetwork = loginNetwork.slice(-1).shift();
  } else if (!loginNetwork) {
    loginNetwork = loginUrl ? networks.customNode : networks.default;
  }

  const network = Object.assign({}, getNetwork(loginNetwork.code));

  switch (action.type) {
    case actionTypes.storeCreated:
      // It stops activePeer to be overridden to mainnet
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
