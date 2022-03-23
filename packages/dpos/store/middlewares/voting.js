import { actionTypes } from '@common/configuration';
import { votesRetrieved, votesReset } from '../actions/voting';

const votingMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.accountLoggedIn:
    case actionTypes.accountUpdated:
      store.dispatch(votesRetrieved());
      break;
    case actionTypes.accountLoggedOut:
      store.dispatch(votesReset());
      break;
    default: break;
  }
};

export default votingMiddleware;
