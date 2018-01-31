import { activePeerSet } from '../../actions/peers';
import actionTypes from '../../constants/actions';
import networks from './../../constants/networks';
import getNetwork from './../../utils/getNetwork';
import { getSavedAccounts } from '../../utils/savedAccounts';

const peersMiddleware = store => next => (action) => {
  next(action);

  const network = Object.assign({}, getNetwork(networks.testnet.code));
  const hasNoAccounts = !getSavedAccounts().length;

  switch (action.type) {
    case actionTypes.storeCreated:
      if (hasNoAccounts) {
        store.dispatch(activePeerSet({ network, noSavedAccounts: true }));
      }
      break;
    default: break;
  }
};

export default peersMiddleware;
