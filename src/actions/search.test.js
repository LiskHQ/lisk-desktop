import actionTypes from '../constants/actions';
import * as searchAPI from '../utils/api/search';
import * as accountAPI from '../utils/api/account';
import * as delegateAPI from '../utils/api/delegate';
import {
  searchSuggestions,
  searchMoreVoters,
} from './search';

jest.mock('../utils/api/search');
jest.mock('../utils/api/account');
jest.mock('../utils/api/delegate');

describe('actions: search', () => {
  const dispatch = jest.fn();
  const getState = () => ({
    peers: { liskAPIClient: {} },
  });

  it('should clear suggestions and search for {delegates,addresses,transactions}', async () => {
    searchAPI.default.mockResolvedValue({});
    const data = { liskAPIClient: {}, searchTerm: '' };
    const action = searchSuggestions(data);
    await action(dispatch, getState);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      data: {},
      type: actionTypes.searchClearSuggestions,
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      data: {},
      type: actionTypes.searchSuggestions,
    });
  });

  it('should call to searchMoreVoters no publicKey', () => {
    accountAPI.getAccount.mockResolvedValue({ publicKey: null });
    const address = '123L';
    const offset = 0;
    const limit = 100;
    const action = searchMoreVoters({ address, offset, limit });
    action(dispatch, getState);
    expect(dispatch).not.toHaveBeenCalledWith();
  });

  it('should call to searchMoreVoters no publicKey offset or limit', () => {
    accountAPI.getAccount.mockResolvedValue({ publicKey: null });
    const address = '123L';
    const action = searchMoreVoters({ address });
    action(dispatch, getState);
    expect(dispatch).not.toHaveBeenCalledWith();
  });

  it('should call to searchMoreVoters no offset or limit', () => {
    const publicKey = 'my-key';
    accountAPI.getAccount.mockResolvedValue({ publicKey });
    delegateAPI.getVoters.mockResolvedValue({
      data: { voters: [] },
    });
    const address = '123L';
    const action = searchMoreVoters({ address });
    action(dispatch, getState);
    expect(dispatch).not.toHaveBeenCalledWith({
      type: actionTypes.searchVoters,
      data: {
        voters: [],
      },
    });
  });
});
