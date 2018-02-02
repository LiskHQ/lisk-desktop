import { activePeerSet } from '../../actions/peers';
import actionTypes from '../../constants/actions';
import networks from './../../constants/networks';
import getNetwork from './../../utils/getNetwork';

const peersMiddleware = store => next => (action) => {
  next(action);

  const network = Object.assign({}, getNetwork(networks.mainnet.code));
  const hasNoSavedAccounts = !JSON.parse(localStorage.getItem('accounts')).length;

  switch (action.type) {
    case actionTypes.storeCreated:
      if (hasNoSavedAccounts) {
        store.dispatch(activePeerSet({ network, noSavedAccounts: true }));
      }
      break;
    default: break;
  }
};

export default peersMiddleware;
