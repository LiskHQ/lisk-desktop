import walletActionTypes from '@wallet/store/actionTypes';
import middleware from './voting';

describe('voting middleware', () => {
  it('should passes the action to next middleware', () => {
    const givenAction = {
      type: 'TEST_ACTION',
    };
    const next = jest.fn();
    const store = {
      getState: jest.fn(),
      dispatch: jest.fn(),
    };

    middleware(store)(next)(givenAction);
    expect(next).toHaveBeenCalledWith(givenAction);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  describe('on accountUpdated action', () => {
    const givenAction = {
      type: walletActionTypes.accountUpdated,
    };
    const next = jest.fn();
    const store = {
      getState: jest.fn(),
      dispatch: jest.fn(),
    };
    it('should dispatch stakesRetrieved with empty array', () => {
      middleware(store)(next)(givenAction);
      expect(next).toHaveBeenCalledWith(givenAction);
      expect(store.dispatch).toHaveBeenCalled();
    });
  });
});
