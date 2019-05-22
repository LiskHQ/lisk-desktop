import io from 'socket.io-client';
import actionTypes from '../../constants/actions';
import { liskAPIClientUpdate } from '../../actions/peers';

let connection;
let forcedClosing = false;

const closeConnection = () => {
  if (connection) {
    forcedClosing = true;
    connection.close();
    forcedClosing = false;
  }
};

// This is a hack to get a signal to check for changes in BTC account and transactions
// only once per minute and not every 10 seconds as we do for LSK
// TODO find a cleaner way for shouldUpdateBtc
let lastBtcUpdate = new Date();
const shouldUpdateBtc = (state) => {
  const now = new Date();
  const oneMinute = 1000 * 60;
  console.log('socckc', !(state.settings.token && state.settings.token.active === 'BTC'), now - lastBtcUpdate, now - lastBtcUpdate > oneMinute);
  if (!(state.settings.token && state.settings.token.active === 'BTC') || now - lastBtcUpdate > oneMinute) {
    lastBtcUpdate = now;
    return true;
  }
  return false;
};

const socketSetup = (store) => {
  let windowIsFocused = true;
  const { ipc } = window;
  if (ipc && ipc.on) {
    ipc.on('blur', () => { windowIsFocused = false; });
    ipc.on('focus', () => { windowIsFocused = true; });
  }

  connection = io.connect(store.getState().peers.liskAPIClient.currentNode);
  connection.on('blocks/change', (block) => {
    if (shouldUpdateBtc(store.getState())) {
      store.dispatch({
        type: actionTypes.newBlockCreated,
        data: { block, windowIsFocused },
      });
    }
  });
  connection.on('disconnect', () => {
    if (!forcedClosing) {
      store.dispatch(liskAPIClientUpdate({ online: false }));
    }
  });
  connection.on('reconnect', () => {
    store.dispatch(liskAPIClientUpdate({ online: true }));
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
