import { actionTypes, networks, loginTypes } from '@constants';
import {
  voteEdited,
  votesCleared,
  votesSubmitted,
  votesConfirmed,
  votesRetrieved,
} from './voting';
import * as TransactionApi from '@api/transaction';
import * as delegateApi from '@api/delegate';
import sampleVotes from '../../../test/constants/votes';

jest.mock('@api/transaction', () => ({
  create: jest.fn(),
}));

jest.mock('@api/delegate', () => ({
  getVotes: jest.fn(),
}));

describe('actions: voting', () => {
  const getState = () => ({
    network: {
      name: networks.mainnet.name,
      networks: {
        LSK: {
        },
      },
    },
    account: {
      loginType: loginTypes.passphrase.code,
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
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('voteEdited', () => {
    it('should create an action to add data to toggle the vote status for any given delegate', () => {
      const data = [{
        address: 'dummy',
        amount: 1e10,
      }];
      const expectedAction = {
        data,
        type: actionTypes.voteEdited,
      };

      expect(voteEdited(data)).toEqual(expectedAction);
    });
  });

  describe('votesSubmitted', () => {
    it('should call create transactions', async () => {
      TransactionApi.create.mockResolvedValue({ data: sampleVotes[0] });
      const data = [{
        address: 'dummy',
        amount: 1e10,
      }];
      const dispatch = jest.fn();

      await votesSubmitted(data)(dispatch, getState);
      expect(TransactionApi.create).toHaveBeenCalled();
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
      const dispatch = jest.fn();
      delegateApi.getVotes.mockImplementation(() => Promise.resolve({ data: votes }));
      await votesRetrieved()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
});
