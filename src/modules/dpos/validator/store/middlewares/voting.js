import walletActionTypes from '@wallet/store/actionTypes';
import { votesRetrieved, votesReset } from '../actions/voting';

const votingMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case walletActionTypes.accountLoggedIn:
    case walletActionTypes.accountUpdated:
      store.dispatch(votesRetrieved());
      break;
    case walletActionTypes.accountLoggedOut:
      store.dispatch(votesReset());
      break;
    default: break;
  }
};

export default votingMiddleware;
