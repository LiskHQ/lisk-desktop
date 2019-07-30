import actionTypes from '../constants/actions';
import networks from '../constants/networks';
import * as accountAPI from '../utils/api/account';
import * as delegateAPI from '../utils/api/delegates';
import accounts from '../../test/constants/accounts';
import * as actions from './search';

const {
  fetchVotedDelegateInfo,
  searchAccount,
} = actions;

jest.mock('../utils/api/account');
jest.mock('../utils/api/delegates');
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

      delegateAPI.getDelegates.mockResolvedValue(delegates);
      await fetchVotedDelegateInfo(votes, { address })(dispatch, getState);

      // TODO figure out how to make this assertion work and remove the 'not'
      expect(fetchVotedDelegateInfoSpy).not.toHaveBeenCalledWith(votes, {
        offset: 100,
        showingVotes: 30,
      });
    });

    it('should dispatch searchVotes action if we have all info for all votes', async () => {
      delegateAPI.getDelegates.mockResolvedValue(delegates);
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
