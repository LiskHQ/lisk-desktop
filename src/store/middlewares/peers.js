import { activePeerSet, activePeerUpdate } from '../../actions/peers';
import actionTypes from '../../constants/actions';
import networks from './../../constants/networks';
import getNetwork from './../../utils/getNetwork';
import { shouldAutoLogIn } from './../../utils/login';

const peersMiddleware = store => next => (action) => {
  next(action);

  const network = Object.assign({}, getNetwork(networks.mainnet.code));

  switch (action.type) {
    case actionTypes.storeCreated:
      // It changes network back to mainnet when we want to autologin for explorer account
      if (!shouldAutoLogIn) {
        store.dispatch(activePeerSet({ network }));
      }
      store.dispatch(activePeerUpdate({ online: true }));
      break;
    default: break;
  }
};

export default peersMiddleware;
