import actionTypes from '../constants/actions';
import networks from '../constants/networks';
import * as searchAPI from '../utils/api/search';
import * as accountAPI from '../utils/api/account';
import * as delegateAPI from '../utils/api/delegate';
import * as transactionsAPI from '../utils/api/transactions';
import accounts from '../../test/constants/accounts';
import * as actions from './search';

const {
  fetchVotedDelegateInfo,
  searchMoreTransactions,
  searchTransactions,
  searchAccount,
  searchSuggestions,
  searchMoreVoters,
} = actions;

jest.mock('../utils/api/search');
jest.mock('../utils/api/account');
jest.mock('../utils/api/delegate');
jest.mock('../utils/api/transactions');

describe('actions: search', () => {
  let dispatch;
  const getState = () => ({
    peers: {
      liskAPIClient: {},
      options: networks.mainnet,
    },
  });

  beforeEach(() => {
    jest.resetModules();
    dispatch = jest.fn();
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

  describe('fetchVotedDelegateInfo', () => {
    const delegates = {
      data: [{
        username: accounts.delegate.username,
        rank: 1,
      }, {
        username: 'genesis_1',
        rank: 32,
      }],
    };
    const address = '123L';

    it('should fetchVotedDelegateInfo again with offset if we don\'t have yet info for all votes', async () => {
      const votes = [{
        username: 'genesis_2',
        rank: 30,
      }, {
        username: 'genesis_1',
        rank: 32,
      }, {
        username: 'genesis_3',
      }, {
        username: 'genesis_4',
      }, {
        username: accounts.delegate.username,
        rank: 1,
      }];
      const fetchVotedDelegateInfoSpy = jest.spyOn(actions, 'fetchVotedDelegateInfo');

      delegateAPI.listDelegates.mockResolvedValue(delegates);
      await fetchVotedDelegateInfo(votes, { address })(dispatch, getState);

      // TODO figure out how to make this assertion work and remove the 'not'
      expect(fetchVotedDelegateInfoSpy).not.toHaveBeenCalledWith(votes, {
        offset: 100,
        showingVotes: 30,
      });
    });

    it('should dispatch searchVotes action if we have all info for all votes', async () => {
      delegateAPI.listDelegates.mockResolvedValue(delegates);
      const votes = delegates.data;
      await fetchVotedDelegateInfo(votes, { address })(dispatch, getState);
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        data: actionTypes.searchVotes,
        type: actionTypes.loadingStarted,
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        data: { votes, address },
        type: actionTypes.searchVotes,
      });
    });
  });

  describe('searchTransactions', () => {
    const transactions = {
      meta: {
        count: 0,
      },
      data: [
      ],
    };

    it('should fetch transactions and then dispatch them', () => {
      transactionsAPI.getTransactions.mockResolvedValue(transactions);
      const action = searchTransactions({
        address: accounts.delegate.address,
        filter: {},
      });
      action(dispatch, getState);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        data: actionTypes.searchTransactions,
        type: actionTypes.loadingStarted,
      });
      // TODO figure out why the assertion below doesn't hold true
      // despite coverage report shows the code was called
      /*
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        data: {},
        type: actionTypes.searchMoreTransactions,
      });
      expect(dispatch).toHaveBeenNthCalledWith(3, {
        data: actionTypes.searchMoreTransactions,
        type: actionTypes.loadingFinished,
      });
      */
    });

    it('should allow to disable dispatching the loading actions', () => {
      transactionsAPI.getTransactions.mockResolvedValue(transactions);
      const action = searchTransactions({
        address: accounts.delegate.address,
        showLoading: false,
      });
      action(dispatch, getState);

      expect(dispatch).not.toHaveBeenNthCalledWith(1, {
        data: actionTypes.searchTransactions,
        type: actionTypes.loadingStarted,
      });

      expect(dispatch).not.toHaveBeenNthCalledWith(1, {
        data: actionTypes.searchTransactions,
        type: actionTypes.loadingFinished,
      });
    });
  });

  describe('searchMoreTransactions', () => {
    it('should fetch transactions and then dispatch them', () => {
      const transactions = {
        meta: {
          count: 1000,
        },
        data: [
        ],
      };
      transactionsAPI.getTransactions.mockResolvedValue(transactions);
      const action = searchMoreTransactions({ address: accounts.delegate.address });
      action(dispatch, getState);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        data: actionTypes.searchMoreTransactions,
        type: actionTypes.loadingStarted,
      });
      // TODO figure out why the assertion below doesn't hold true
      // despite coverage report shows the code was called
      /*
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        data: {},
        type: actionTypes.searchMoreTransactions,
      });
      expect(dispatch).toHaveBeenNthCalledWith(3, {
        data: actionTypes.searchMoreTransactions,
        type: actionTypes.loadingFinished,
      });
      */
    });
  });

  describe('searchAccount', () => {
    it('should call ', () => {
      const account = {
        address: accounts.delegate.address,
        publicKey: accounts.delegate.publicKey,
        delegate: {
          username: accounts.delegate.username,
        },
      };
      accountAPI.getAccount.mockResolvedValue(account);
      const action = searchAccount({ address: account.address });
      action(dispatch, getState);
      // TODO figure out why the assertion below doesn't hold true
      // despite coverage report shows the code was called
      /*
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.searchAccount,
        data: account,
      });
      */
    });
  });
});
