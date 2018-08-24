import io from 'socket.io-client';
import actionTypes from '../../constants/actions';
import { activePeerUpdate } from '../../actions/peers';

let connection;
let forcedClosing = false;

const closeConnection = () => {
  if (connection) {
    forcedClosing = true;
    connection.close();
    forcedClosing = false;
  }
};

const socketSetup = (store) => {
  let windowIsFocused = true;
  const { ipc } = window;
  if (ipc && ipc.on) {
    ipc.on('blur', () => { windowIsFocused = false; });
    ipc.on('focus', () => { windowIsFocused = true; });
  }

  connection = io.connect(store.getState().peers.data.currentNode);
  connection.on('blocks/change', (block) => {
    store.dispatch({
      type: actionTypes.newBlockCreated,
      data: { block, windowIsFocused },
    });
  });
  connection.on('disconnect', () => {
    if (!forcedClosing) {
      store.dispatch(activePeerUpdate({ online: false }));
    }
  });
  connection.on('reconnect', () => {
    store.dispatch(activePeerUpdate({ online: true }));
  });
};

const socketMiddleware = store => (
  next => (action) => {
    switch (action.type) {
      case actionTypes.accountLoggedIn:
        socketSetup(store, action);
        break;
      case actionTypes.accountLoggedOut:
        closeConnection();
        break;
      /* istanbul ignore next */
      default: break;
    }
    next(action);
  });

export default socketMiddleware;
