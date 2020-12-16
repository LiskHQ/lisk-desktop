import actionTypes from '../constants/actions';
import {
  voteEdited,
  votesCleared,
  votesSubmitted,
  votesConfirmed,
  votesRetrieved,
} from './voting';
import networks from '../constants/networks';
import * as TransactionApi from '../utils/api/transaction';
import sampleVotes from '../../test/constants/votes';
import { loginType } from '../constants/hwConstants';

jest.mock('../utils/api/transaction', () => ({
  create: jest.fn(),
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
      loginType: loginType.normal,
      info: {
        LSK: {
          address: '123L',
          votes: [{ delegateAddress: '123L', amount: 1e9 }],
        },
      },
    },
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
    it('should call getVotes and dispatch vote results', () => {
      const expectedAction = {
        type: actionTypes.votesRetrieved,
        data: [{ delegateAddress: '123L', amount: 1e9 }],
      };
      const dispatch = jest.fn();
      votesRetrieved()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
});
