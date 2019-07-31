import actionTypes from '../constants/actions';
import networks from '../constants/networks';
import * as accountAPI from '../utils/api/account';
import accounts from '../../test/constants/accounts';
import * as actions from './search';

const {
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
