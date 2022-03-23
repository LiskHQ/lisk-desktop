import { actionTypes, networks, loginTypes } from '@common/configuration';
import * as transactionApi from '@transaction/api';
import * as delegateApi from '@dpos/delegate/api';
import * as accountApi from '@wallet/api';
import * as hwManager from '@common/utilities/hwManager';
import {
  voteEdited,
  votesCleared,
  votesSubmitted,
  votesConfirmed,
  votesRetrieved,
} from './voting';
import sampleVotes from '../../../test/constants/votes';
import accounts from '../../../test/constants/accounts';

jest.mock('@transaction/api', () => ({
  create: jest.fn(),
  computeTransactionId: jest.fn(),
}));

jest.mock('@dpos/delegate/api', () => ({
  getVotes: jest.fn(),
}));

jest.mock('@wallet/api', () => ({
  getAccount: jest.fn(),
}));

jest.mock('@common/utilities/hwManager', () => ({
  signTransactionByHW: jest.fn(),
}));

describe('actions: voting', () => {
  const getState = () => ({
    network: {
      name: networks.mainnet.name,
      networks: {
        LSK: {
          serviceUrl: 'http://example.api',
        },
      },
    },
    account: {
      loginType: 0,
      info: {
        LSK: {
          summary: {
            address: '123L',
          },
          sequence: {
            nonce: 1,
          },
          votes: [{ delegateAddress: '123L', amount: 1e9 }],
        },
      },
    },
    settings: {
      token: {
        active: 'LSK',
      },
    },
  });

  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('voteEdited', () => {
    it('should create an action to add data to toggle the vote status for any given delegate', async () => {
      accountApi.getAccount.mockResolvedValue({ data: accounts.genesis });
      const data = [{
        address: 'dummy',
        amount: 1e10,
      }];
      await voteEdited(data)(dispatch, getState);
      expect(accountApi.getAccount).toHaveBeenCalled();
    });

    it('creates an action to add data to toggle the vote status for any given delegate, without calling getAccount', async () => {
      const data = [{
        address: 'dummy',
        amount: 1e10,
        username: 'genesis',
      }];
      await voteEdited(data)(dispatch, getState);
      expect(accountApi.getAccount).not.toHaveBeenCalled();
    });
  });

  describe('votesSubmitted', () => {
    it('should call create transactions', async () => {
      const tx = { data: sampleVotes[0] };
      transactionApi.create.mockResolvedValue(tx);
      const data = [{
        address: 'dummy',
        amount: 1e10,
      }];

      await votesSubmitted(data)(dispatch, getState);
      expect(transactionApi.create).toHaveBeenCalled();
      expect(hwManager.signTransactionByHW).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.votesSubmitted,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('should call create transactions', async () => {
      const tx = { data: sampleVotes[0] };
      loginTypes.passphrase.code = 1;
      const data = [{
        address: 'dummy',
        amount: 1e10,
      }];

      await votesSubmitted(data)(dispatch, getState);
      expect(transactionApi.create).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.votesSubmitted,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('dispatches a transactionSignError action if an error occurs', async () => {
      const error = new Error('Error message.');
      transactionApi.create.mockRejectedValue(error);
      const data = [{
        address: 'dummy',
        amount: 1e10,
      }];

      await votesSubmitted(data)(dispatch, getState);
      expect(transactionApi.create).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionSignError,
        data: error,
      });
    });
  });

  describe('votesConfirmed', () => {
    it('should dispatch vote type without data', () => {
      const expectedAction = {
        type: actionTypes.votesConfirmed,
      };

      expect(votesConfirmed()).toEqual(expectedAction);
    });
  });

  describe('votesCleared', () => {
    it('should dispatch vote type without data', () => {
      const expectedAction = {
        type: actionTypes.votesCleared,
      };

      expect(votesCleared()).toEqual(expectedAction);
    });
  });

  describe('votesRetrieved', () => {
    it('should call getVotes and dispatch vote results', async () => {
      const votes = [{ address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99', username: 'genesis', amount: 1e8 }];
      const expectedAction = {
        type: actionTypes.votesRetrieved,
        data: votes,
      };
      delegateApi.getVotes.mockImplementation(() => Promise.resolve({ data: votes }));
      await votesRetrieved()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
});
