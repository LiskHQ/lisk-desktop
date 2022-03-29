import { accountLoggedIn, accountLoggedOut, accountUpdated } from '@wallet/store/actionTypes';
import { votesRetrieved, votesReset } from '../actions/voting';

const votingMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case accountLoggedIn:
    case accountUpdated:
      store.dispatch(votesRetrieved());
      break;
    case accountLoggedOut:
      store.dispatch(votesReset());
      break;
    default: break;
  }
};

export default votingMiddleware;
