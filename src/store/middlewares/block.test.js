import middleware from './block';
import actionTypes from '../../constants/actions';
import { blockSubscribe, blockUnsubscribe } from '../../utils/api/block';
import { olderBlocksRetrieved } from '../../actions/blocks';

jest.mock('../../utils/api/block');
jest.mock('../../actions/blocks');

describe('Block middleware', () => {
  it('Should subscribe to block/change when actionTypes.networkConfigSet', () => {
    const state = {
      blocks: { latestBlocks: [1] },
      network: {},
    };
    const store = {
      dispatch: jest.fn(),
      getState: () => state,
    };
    const action = {
      type: actionTypes.networkConfigSet,
    };
    const newConnections = { 'block/change': { connection: {}, forcedClosing: false } };
    blockSubscribe.mockImplementation(() => newConnections);
    blockUnsubscribe.mockImplementation(() => ({}));
    middleware(store)(() => {})(action);

    expect(blockSubscribe).toHaveBeenCalledTimes(1);
    expect(blockUnsubscribe).toHaveBeenCalledTimes(1);
    expect(olderBlocksRetrieved).toHaveBeenCalledTimes(1);

    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      data: {},
      type: actionTypes.socketConnectionsUpdated,
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(3, {
      data: { ...newConnections },
      type: actionTypes.socketConnectionsUpdated,
    });
  });
});
