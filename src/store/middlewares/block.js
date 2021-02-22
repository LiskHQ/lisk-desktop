import actionTypes from '../../constants/actions';
import { networkStatusUpdated } from '../../actions/network';
import { olderBlocksRetrieved, forgingTimesRetrieved } from '../../actions/blocks';
import { blockSubscribe, blockUnsubscribe } from '../../utils/api/block';
import { forgersSubscribe, forgersUnsubscribe, getDelegates } from '../../utils/api/delegate';
import { tokenMap } from '../../constants/tokens';

const oneMinute = 1000 * 60;

const generateOnDisconnect = dispatch => () => {
  dispatch(networkStatusUpdated({ online: false }));
};

const generateOnReconnect = dispatch => () => {
  dispatch(networkStatusUpdated({ online: true }));
};

// eslint-disable-next-line max-statements
const blockListener = ({ getState, dispatch }) => {
  const state = getState();
  blockUnsubscribe();

  // eslint-disable-next-line max-statements
  const callback = (block) => {
    const { settings, network, blocks } = getState();
    const activeToken = settings.token && state.settings.token.active;
    const lastBtcUpdate = network.lastBtcUpdate || 0;
    const now = new Date();

    if ((activeToken !== tokenMap.BTC.key) || now - lastBtcUpdate > oneMinute) {
      dispatch({
        type: actionTypes.newBlockCreated,
        data: { block },
      });
      if (activeToken === tokenMap.BTC.key) {
        dispatch({
          type: actionTypes.lastBtcUpdateSet,
          data: now,
        });
      }
    }

    if (Object.keys(blocks.forgingTimes).length === 0 || blocks.awaitingForgers.length === 0) {
      dispatch(forgingTimesRetrieved());
    }
  };

  blockSubscribe(
    state.network,
    callback,
    generateOnDisconnect(dispatch),
    generateOnReconnect(dispatch),
  );
};

const forgingListener = ({ getState, dispatch }) => {
  const state = getState();
  forgersUnsubscribe();

  const callback = async (round) => {
    if (getState().blocks.latestBlocks.length) {
      try {
        const delegates = await getDelegates({
          params: { addressList: round.nextForgers },
          network: state.network,
        });
        dispatch(forgingTimesRetrieved(delegates.data));
      } catch (e) {
        dispatch(forgingTimesRetrieved());
      }
    }
  };

  forgersSubscribe(
    state.network,
    callback,
    generateOnDisconnect(dispatch),
    generateOnReconnect(dispatch),
  );
};

const blockMiddleware = store => (
  next => (action) => {
    next(action);
    switch (action.type) {
      case actionTypes.networkConfigSet:
        store.dispatch(olderBlocksRetrieved());
        blockListener(store);
        forgingListener(store);
        break;

      default: break;
    }
  });

export default blockMiddleware;
