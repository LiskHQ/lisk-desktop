import io from '../../utils/socketShim';
import actionTypes from '../../constants/actions';
import { activePeerUpdate } from '../../actions/peers';
import { SYNC_ACTIVE_INTERVAL, SYNC_INACTIVE_INTERVAL } from '../../constants/api';

let connection;
let forcedClosing = false;

const socketSetup = (store) => {
  let interval = SYNC_ACTIVE_INTERVAL;
  const { ipc } = window;
  if (ipc) {
    ipc.on('blur', () => { interval = SYNC_INACTIVE_INTERVAL; });
    ipc.on('focus', () => { interval = SYNC_ACTIVE_INTERVAL; });
  }
  connection = io.connect(`ws://${store.getState().peers.data.currentPeer}:${store.getState().peers.data.port}`);
  connection.on('blocks/change', (block) => {
    store.dispatch({
      type: actionTypes.newBlockCreated,
      data: { block, interval },
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
const closeConnection = () => {
  if (connection) {
    forcedClosing = true;
    connection.close();
    forcedClosing = false;
  }
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
