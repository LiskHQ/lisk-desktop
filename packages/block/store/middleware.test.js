import { olderBlocksRetrieved } from '@actions';
import { actionTypes } from '@constants';
import { blockSubscribe, blockUnsubscribe } from '@common/utilities/api/block';
import middleware from './block';

jest.mock('@common/utilities/api/block');
jest.mock('@common/utilities/api/delegate');
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
    middleware(store)(() => {})(action);

    expect(blockSubscribe).toHaveBeenCalledTimes(1);
    expect(blockUnsubscribe).toHaveBeenCalledTimes(1);
    expect(olderBlocksRetrieved).toHaveBeenCalledTimes(1);
  });
});
