import middleware from './block';
import actionTypes from '../../constants/actions';
import { blockSubscribe, blockUnsubscribe } from '../../utils/api/block';
import { olderBlocksRetrieved } from '../../actions/blocks';

jest.mock('../../utils/api/block');
jest.mock('../../actions/blocks');

describe('Block middleware', () => {
  it('Should subscribe to block/change when actionTypes.serviceUrlSet', () => {
    const state = { blocks: { latestBlocks: [1] } };
    const store = {
      dispatch: jest.fn(),
      getState: () => state,
    };
    const action = {
      type: actionTypes.serviceUrlSet,
    };
    middleware(store)(() => {})(action);

    expect(blockSubscribe).toHaveBeenCalledTimes(1);
    expect(blockUnsubscribe).toHaveBeenCalledTimes(1);
    expect(olderBlocksRetrieved).toHaveBeenCalledTimes(1);
  });
});
