import { activePeerSet, activePeerUpdate } from '../../actions/peers';
import actionTypes from '../../constants/actions';
import networks from './../../constants/networks';
import getNetwork from './../../utils/getNetwork';
import { shouldAutoLogIn, getAutoLogInData } from './../../utils/login';

const peersMiddleware = store => next => (action) => {
  next(action);

  const network = Object.assign({}, getNetwork(networks.mainnet.code));
  const autologinData = getAutoLogInData();

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
