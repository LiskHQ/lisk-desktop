import { activePeerSet } from '../../actions/peers';
import actionTypes from '../../constants/actions';
import networks from './../../constants/networks';
import getNetwork from './../../utils/getNetwork';
import localJSONStorage from './../../utils/localJSONStorage';

const peersMiddleware = store => next => (action) => {
  next(action);

  const network = Object.assign({}, getNetwork(networks.mainnet.code));
  const hasNoSavedAccounts = !localJSONStorage.get('accounts', []).length;

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
