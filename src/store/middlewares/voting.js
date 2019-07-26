import { delegatesAdded } from '../../actions/voting';
import actionTypes from '../../constants/actions';

const votingMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.accountLoggedOut:
      store.dispatch(delegatesAdded({ list: [] }));
      store.dispatch({
        type: actionTypes.votesAdded,
        data: { list: [] },
      });
      break;
    default: break;
  }
};

export default votingMiddleware;
