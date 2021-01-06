import actionTypes from '../../constants/actions';
import { networkStatusUpdated } from '../../actions/network';
import { olderBlocksRetrieved, forgingTimesRetrieved } from '../../actions/blocks';
import { blockSubscribe, blockUnsubscribe } from '../../utils/api/block';
import { tokenMap } from '../../constants/tokens';

const intervalTime = 5000;
let interval;

// eslint-disable-next-line max-statements
const blockListener = ({ getState, dispatch }) => {
  const state = getState();

  const socketConnections = blockUnsubscribe(state.network);
  dispatch({
    type: actionTypes.socketConnectionsUpdated,
    data: socketConnections,
  });

  let windowIsFocused = true;
  const { ipc } = window;
  if (ipc && ipc.on) {
    ipc.on('blur', () => { windowIsFocused = false; });
    ipc.on('focus', () => { windowIsFocused = true; });
  }

  const onDisconnect = (eventName) => {
    const networkState = getState().network;
    const connection = networkState.socketConnections && networkState.socketConnections[eventName];
    if (connection && !connection.forcedClosings) {
      dispatch(networkStatusUpdated({ online: false }));
    }
  };

  const onReconnect = () => {
    dispatch(networkStatusUpdated({ online: true }));
  };

  const callback = (block) => {
    const { settings, network } = getState();
    const activeToken = settings.token && state.settings.token.active;
    const lastBtcUpdate = network.lastBtcUpdate || 0;
    const now = new Date();
    const oneMinute = 1000 * 60;

    if ((activeToken !== tokenMap.BTC.key) || now - lastBtcUpdate > oneMinute) {
      dispatch({
        type: actionTypes.newBlockCreated,
        data: { block, windowIsFocused },
      });
      if (activeToken === tokenMap.BTC.key) {
        dispatch({
          type: actionTypes.lastBtcUpdateSet,
          data: now,
        });
      }
    }
  };

  const newConnection = blockSubscribe(state.network, callback, onDisconnect, onReconnect);
  dispatch({
    type: actionTypes.socketConnectionsUpdated,
    data: { ...state.network.socketConnections, ...newConnection },
  });
};

const blockMiddleware = ({ getState, dispatch }) => (
  next => (action) => {
    next(action);
    switch (action.type) {
      case actionTypes.networkConfigSet:
        dispatch(olderBlocksRetrieved());
        blockListener({ getState, dispatch });
        clearInterval(interval);
        interval = setInterval(() => {
          // if user refreshes the page, we might have a race condition here.
          // I'll skip the first retrieval since it is useless without the blocks list
          if (getState().blocks.latestBlocks.length) {
            dispatch(forgingTimesRetrieved());
          }
        }, intervalTime);
        break;

      default: break;
    }
  });

export default blockMiddleware;
