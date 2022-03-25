import { olderBlocksRetrieved } from '@common/store/actions';
import { actionTypes } from '@common/configuration';
import { blockSubscribe, blockUnsubscribe } from '@block/api';
import middleware from './middleware';

jest.mock('@block/api');
jest.mock('@dpos/delegate/api');
jest.mock('@common/store/actions/blocks');

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
