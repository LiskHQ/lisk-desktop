import { votesRetrieved, votesReset } from '@actions';
import { actionTypes } from '@constants';

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
