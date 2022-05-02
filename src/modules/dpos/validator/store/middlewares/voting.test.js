import walletActionTypes from '@wallet/store/actionTypes';
import dposActionTypes from '../actions/actionTypes';
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

  describe('on accountLoggedOut action', () => {
    const givenAction = {
      type: walletActionTypes.accountLoggedOut,
    };
    const expectedAction = {
      type: dposActionTypes.votesReset,
    };
    const next = jest.fn();
    const store = {
      getState: jest.fn(),
      dispatch: jest.fn(),
    };
    it('should dispatch votesRetrieved with empty array', () => {
      middleware(store)(next)(givenAction);
      expect(next).toHaveBeenCalledWith(givenAction);
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('on accountLoggedIn action', () => {
    const givenAction = {
      type: walletActionTypes.accountLoggedIn,
    };
    const next = jest.fn();
    const store = {
      getState: jest.fn(),
      dispatch: jest.fn(),
    };
    it('should dispatch votesRetrieved with empty array', () => {
      middleware(store)(next)(givenAction);
      expect(next).toHaveBeenCalledWith(givenAction);
      expect(store.dispatch).toHaveBeenCalled();
    });
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
    it('should dispatch votesRetrieved with empty array', () => {
      middleware(store)(next)(givenAction);
      expect(next).toHaveBeenCalledWith(givenAction);
      expect(store.dispatch).toHaveBeenCalled();
    });
  });
});
