import actionTypes from '../../constants/actions';
import { socketSetup } from '../../utils/socket';

const socketMiddleware = store => (
  next => (action) => {
    switch (action.type) {
      case actionTypes.accountLoggedIn:
        socketSetup(store, action);
        break;
      default: break;
    }
    next(action);
  });

export default socketMiddleware;
