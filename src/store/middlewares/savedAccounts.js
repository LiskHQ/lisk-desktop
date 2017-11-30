import actionTypes from '../../constants/actions';
import { accountLoggedOut } from '../../actions/account';
import { activePeerSet } from '../../actions/peers';
import getNetwork from '../../utils/getNetwork';

const savedAccountsMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.accountSwitched:
      store.dispatch(accountLoggedOut());
      store.dispatch(activePeerSet({
        publicKey: action.data.publicKey,
        network: {
          ...getNetwork(action.data.network),
          address: action.data.address,
        },
      }));
      break;
    default:
      break;
  }
};

export default savedAccountsMiddleware;
