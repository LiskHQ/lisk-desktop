import io from '../../utils/socketShim';
import actionTypes from '../../constants/actions';
import { activePeerUpdate } from '../../actions/peers';

let connection;
let forcedClosing = false;

const openConnection = (state) => {
  const ssl = state.peers.data.options.ssl;
  const protocol = ssl ? 'https' : 'http';

  return io.connect(`${protocol}://${state.peers.data.currentPeer}:${state.peers.data.port}`);
};

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
  if (ipc) {
    ipc.on('blur', () => { windowIsFocused = false; });
    ipc.on('focus', () => { windowIsFocused = true; });
  }

  connection = openConnection(store.getState());
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
      default: break;
    }
    next(action);
  });

export default socketMiddleware;
