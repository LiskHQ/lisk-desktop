import actionTypes from '../../constants/actions';
import { socketSetup, closeConnection } from '../../utils/socket';

const socketMiddleware = store => (
  next => (action) => {
    switch (action.type) {
      case actionTypes.accountLoggedIn:
        socketSetup(store, action);
        break;
      case actionTypes.accountLoggedOut:
        closeConnection();
        break;
      default: break;
    }
    next(action);
  });

export default socketMiddleware;
