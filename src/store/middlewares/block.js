import actionTypes from '../../constants/actions';
import { networkStatusUpdated } from '../../actions/network';
import { olderBlocksRetrieved, forgingTimesRetrieved } from '../../actions/blocks';
import { blockSubscribe, blockUnsubscribe } from '../../utils/api/block';
import { forgersSubscribe, forgersUnsubscribe, getDelegates } from '../../utils/api/delegate';
import { tokenMap } from '../../constants/tokens';

// eslint-disable-next-line max-statements
const blockListener = (store) => {
  const state = store.getState();

  const socketConnections = blockUnsubscribe(state.network);
  store.dispatch({
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
    const networkState = store.getState().network;
    const connection = networkState.socketConnections && networkState.socketConnections[eventName];
    if (connection && !connection.forcedClosings) {
      store.dispatch(networkStatusUpdated({ online: false }));
    }
  };

  const onReconnect = () => {
    store.dispatch(networkStatusUpdated({ online: true }));
  };

  // eslint-disable-next-line max-statements
  const callback = (block) => {
    console.log(block.generatorUsername);
    const { settings, network, blocks } = store.getState();
    const activeToken = settings.token && state.settings.token.active;
    const lastBtcUpdate = network.lastBtcUpdate || 0;
    const now = new Date();
    const oneMinute = 1000 * 60;

    if ((activeToken !== tokenMap.BTC.key) || now - lastBtcUpdate > oneMinute) {
      store.dispatch({
        type: actionTypes.newBlockCreated,
        data: { block, windowIsFocused },
      });
      if (activeToken === tokenMap.BTC.key) {
        store.dispatch({
          type: actionTypes.lastBtcUpdateSet,
          data: now,
        });
      }
    }

    if (Object.keys(blocks.forgingTimes).length === 0 || blocks.awaitingForgers.length === 0) {
      store.dispatch(forgingTimesRetrieved());
    }
  };

  const newConnection = blockSubscribe(state.network, callback, onDisconnect, onReconnect);
  store.dispatch({
    type: actionTypes.socketConnectionsUpdated,
    data: { ...state.network.socketConnections, ...newConnection },
  });
};

const forgingListener = (store) => {
  const state = store.getState();
  const socketConnections = forgersUnsubscribe(state.network);
  store.dispatch({
    type: actionTypes.socketConnectionsUpdated,
    data: socketConnections,
  });

  const newConnection = forgersSubscribe(
    state.network,
    async (round) => {
      if (store.getState().blocks.latestBlocks.length) {
        try {
          const delegates = await getDelegates({
            params: { addressList: round.nextForgers },
            network: state.network,
          });
          store.dispatch(forgingTimesRetrieved(delegates.data));
        } catch (e) {
          store.dispatch(forgingTimesRetrieved());
        }
      }
    },
    () => {},
    () => {},
  );
  store.dispatch({
    type: actionTypes.socketConnectionsUpdated,
    data: { ...state.network.socketConnections, ...newConnection },
  });
};

const blockMiddleware = store => (
  next => (action) => {
    next(action);
    switch (action.type) {
      case actionTypes.networkSet:
        store.dispatch(olderBlocksRetrieved());
        blockListener(store);
        forgingListener(store);
        break;

      default: break;
    }
  });

export default blockMiddleware;
