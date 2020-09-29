import { votesRetrieved } from '../../actions/voting';
import actionTypes from '../../constants/actions';

const votingMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.accountLoggedIn:
      store.dispatch(votesRetrieved());
      break;
    case actionTypes.accountLoggedOut:
      store.dispatch({
        type: actionTypes.votesRetrieved,
        data: [],
      });
      break;
    default: break;
  }
};

export default votingMiddleware;
