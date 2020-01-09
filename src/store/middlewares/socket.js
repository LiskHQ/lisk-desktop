import io from 'socket.io-client';
import actionTypes from '../../constants/actions';
import { networkStatusUpdated } from '../../actions/network';
import { getAPIClient } from '../../utils/api/network';
import { olderBlocksRetrieved, forgingTimesRetrieved } from '../../actions/blocks';

const intervalTime = 5000;
let interval;
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
  if (!(state.settings.token && state.settings.token.active === 'BTC') || now - lastBtcUpdate > oneMinute) {
    lastBtcUpdate = now;
    return true;
  }
  return false;
};

// eslint-disable-next-line max-statements
const socketSetup = (store) => {
  closeConnection();
  let windowIsFocused = true;
  const { ipc } = window;
  if (ipc && ipc.on) {
    ipc.on('blur', () => { windowIsFocused = false; });
    ipc.on('focus', () => { windowIsFocused = true; });
  }
  const state = store.getState();
  const liskAPIClient = getAPIClient(state.settings.token.active, state);
  connection = io.connect(liskAPIClient.currentNode);
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
      store.dispatch(networkStatusUpdated({ online: false }));
    }
  });
  connection.on('reconnect', () => {
    store.dispatch(networkStatusUpdated({ online: true }));
  });
};

const socketMiddleware = store => (
  next => (action) => {
    next(action);
    switch (action.type) {
      case actionTypes.networkSet:
        store.dispatch(olderBlocksRetrieved());
        socketSetup(store, action);
        break;
      case actionTypes.forgingDataDisplayed:
        if (!interval) {
          interval = setInterval(() => {
            // if user refreshes the page, we might have a race condition here.
            // I'll skip the first retrieval since it is useless without the blocks list
            if (store.getState().blocks.latestBlocks.length) {
              store.dispatch(forgingTimesRetrieved());
            }
          }, intervalTime);
        }
        break;
      case actionTypes.forgingDataConcealed:
        clearInterval(interval);
        interval = null;
        break;
      default: break;
    }
  });

export default socketMiddleware;
