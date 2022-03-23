import { votesRetrieved, votesReset } from '@common/store/actions';
import { actionTypes } from '@common/configuration';

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
