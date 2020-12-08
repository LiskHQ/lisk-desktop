import actionTypes from '../../constants/actions';
import { networkStatusUpdated } from '../../actions/network';
import { olderBlocksRetrieved, forgingTimesRetrieved } from '../../actions/blocks';
import { blockSubscribe, blockUnsubscribe } from '../../utils/api/block';

const intervalTime = 5000;
let interval;

// This is a hack to get a signal to check for changes in BTC account and transactions
// only once per minute and not every 10 seconds as we do for LSK
// TODO find a cleaner way for shouldUpdateBtc
let lastBtcUpdate = new Date();
const shouldUpdate = (activeToken) => {
  const now = new Date();
  const oneMinute = 1000 * 60;
  if (!(activeToken === 'BTC') || now - lastBtcUpdate > oneMinute) {
    lastBtcUpdate = now;
    return true;
  }
  return false;
};

// eslint-disable-next-line max-statements
const blockListener = (store) => {
  blockUnsubscribe();

  let windowIsFocused = true;
  const { ipc } = window;
  if (ipc && ipc.on) {
    ipc.on('blur', () => { windowIsFocused = false; });
    ipc.on('focus', () => { windowIsFocused = true; });
  }
  const state = store.getState();

  const onDisconnect = () => {
    store.dispatch(networkStatusUpdated({ online: false }));
  };

  const onReconnect = () => {
    store.dispatch(networkStatusUpdated({ online: true }));
  };

  const callback = (block) => {
    const activeToken = state.settings.token && state.settings.token.active;
    if (shouldUpdate(activeToken)) {
      store.dispatch({
        type: actionTypes.newBlockCreated,
        data: { block, windowIsFocused },
      });
    }
  };

  blockSubscribe(state.network, callback, onDisconnect, onReconnect);
};

const blockMiddleware = store => (
  next => (action) => {
    next(action);
    switch (action.type) {
      case actionTypes.serviceUrlSet:
        store.dispatch(olderBlocksRetrieved());
        blockListener(store);
        clearInterval(interval);
        interval = setInterval(() => {
          // if user refreshes the page, we might have a race condition here.
          // I'll skip the first retrieval since it is useless without the blocks list
          if (store.getState().blocks.latestBlocks.length) {
            store.dispatch(forgingTimesRetrieved());
          }
        }, intervalTime);
        break;

      default: break;
    }
  });

export default blockMiddleware;
