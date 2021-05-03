import { olderBlocksRetrieved } from '@actions';
import { actionTypes } from '@constants';
import { blockSubscribe, blockUnsubscribe } from '@api/block';
import { forgersSubscribe, forgersUnsubscribe } from '@api/delegate';
import middleware from './block';

jest.mock('@api/block');
jest.mock('@api/delegate');
jest.mock('@actions/blocks');

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
