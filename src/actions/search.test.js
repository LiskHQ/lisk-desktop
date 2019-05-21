import actionTypes from '../constants/actions';
import networks from '../constants/networks';
import txFilters from '../constants/transactionFilters';
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
    network: {
      name: networks.mainnet.name,
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
      type: actionTypes.searchSuggestions,
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
    const count = 0;
    const transactions = {
      meta: {
        count,
      },
      data: [
      ],
    };

    it('should fetch transactions and then dispatch them', async () => {
      const params = {
        address: accounts.delegate.address,
        filter: txFilters.all,
        customFilters: {},
      };
      transactionsAPI.getTransactions.mockResolvedValue(transactions);
      await searchTransactions(params)(dispatch, getState);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        data: actionTypes.searchTransactions,
        type: actionTypes.loadingStarted,
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        data: {
          address: accounts.delegate.address,
          filters: {
            direction: txFilters.all,
          },
          count,
          transactions: transactions.data,
        },
        type: actionTypes.searchTransactions,
      });
      expect(dispatch).toHaveBeenNthCalledWith(3, {
        data: {
          filterName: 'transactions',
          value: params.filter,
        },
        type: actionTypes.addFilter,
      });
      expect(dispatch).toHaveBeenNthCalledWith(4, {
        data: actionTypes.searchTransactions,
        type: actionTypes.loadingFinished,
      });
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
    it('should fetch transactions and then dispatch them', async () => {
      const count = 1000;
      const transactions = {
        meta: {
          count,
        },
        data: [
        ],
      };
      const params = {
        address: accounts.delegate.address,
        filter: txFilters.all,
        customFilters: {},
      };
      transactionsAPI.getTransactions.mockResolvedValue(transactions);
      await searchMoreTransactions(params)(dispatch, getState);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        data: actionTypes.searchMoreTransactions,
        type: actionTypes.loadingStarted,
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        data: {
          address: accounts.delegate.address,
          filters: {
            direction: txFilters.all,
          },
          count,
          transactions: transactions.data,
        },
        type: actionTypes.searchMoreTransactions,
      });
      expect(dispatch).toHaveBeenNthCalledWith(3, {
        data: actionTypes.searchMoreTransactions,
        type: actionTypes.loadingFinished,
      });
    });
  });

  describe('searchAccount', () => {
    it('should call ', async () => {
      const account = {
        address: accounts.delegate.address,
        publicKey: accounts.delegate.publicKey,
        delegate: {
          username: accounts.delegate.username,
        },
        token: 'LSK',
      };
      accountAPI.getAccount.mockResolvedValue(account);
      await searchAccount({ address: account.address })(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.searchAccount,
        data: account,
      });
    });
  });
});
