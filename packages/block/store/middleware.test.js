import { olderBlocksRetrieved } from '@common/store/actions';
import actionTypes from './actionTypes';
import { blockSubscribe, blockUnsubscribe } from '@block/utilities/api';
import middleware from './middleware';

jest.mock('@block/utilities/api');
jest.mock('@dpos/utilities/api');
jest.mock('@block/store/action');

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
