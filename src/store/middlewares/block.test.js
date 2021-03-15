import { olderBlocksRetrieved } from '@actions';
import actionTypes from '@constants';
import middleware from './block';
import { blockSubscribe, blockUnsubscribe } from '../../utils/api/block';
import { forgersSubscribe, forgersUnsubscribe } from '../../utils/api/delegate';

jest.mock('../../utils/api/block');
jest.mock('../../utils/api/delegate');
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

    blockSubscribe.mockImplementation(() => {});
    blockUnsubscribe.mockImplementation(() => {});
    forgersSubscribe.mockImplementation(() => {});
    forgersUnsubscribe.mockImplementation(() => {});
    middleware(store)(() => {})(action);

    expect(blockSubscribe).toHaveBeenCalledTimes(1);
    expect(blockUnsubscribe).toHaveBeenCalledTimes(1);
    expect(forgersSubscribe).toHaveBeenCalledTimes(1);
    expect(forgersUnsubscribe).toHaveBeenCalledTimes(1);
    expect(olderBlocksRetrieved).toHaveBeenCalledTimes(1);
  });
});
