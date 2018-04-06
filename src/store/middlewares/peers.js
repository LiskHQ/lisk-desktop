import { activePeerSet, activePeerUpdate } from '../../actions/peers';
import actionTypes from '../../constants/actions';
import networks from './../../constants/networks';
import getNetwork from './../../utils/getNetwork';
import localJSONStorage from './../../utils/localJSONStorage';

const peersMiddleware = store => next => (action) => {
  next(action);

  const network = Object.assign({}, getNetwork(networks.default.code));
  const hasNoSavedAccounts = !localJSONStorage.get('accounts', []).length;

  switch (action.type) {
    case actionTypes.storeCreated:
      /* istanbul ignore else  */
      if (hasNoSavedAccounts) {
        store.dispatch(activePeerSet({ network, noSavedAccounts: true }));
        store.dispatch(activePeerUpdate({ online: true }));
      }
      break;
    default: break;
  }
};

export default peersMiddleware;
