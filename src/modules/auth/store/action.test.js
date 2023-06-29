import * as accountApi from '@wallet/utils/api';
import * as networkActions from '@network/store/action';
import actionTypes from './actionTypes';
import { secondPassphraseStored, secondPassphraseRemoved } from './action';

jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));
jest.mock('@wallet/utils/api', () => ({
  getAccount: jest.fn(),
  extractAddress: jest.fn(),
}));
jest.mock('@transaction/store/actions', () => ({
  updateTransactions: jest.fn(),
}));
jest.mock('@network/store/action', () => ({
  networkStatusUpdated: jest.fn(),
}));
jest.mock('@wallet/utils/account', () => ({
  extractKeyPair: jest.fn(),
}));

describe('actions: account', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    accountApi.getAccount.mockReset();
    networkActions.networkStatusUpdated.mockReset();
  });

  describe('secondPassphraseStored', () => {
    it('should create an action to reset the account', () => {
      const expectedAction = {
        type: actionTypes.secondPassphraseStored,
      };

      expect(secondPassphraseStored()).toEqual(expectedAction);
    });
  });

  describe('secondPassphraseRemoved', () => {
    it('should create an action to reset the account', () => {
      const expectedAction = {
        type: actionTypes.secondPassphraseRemoved,
      };

      expect(secondPassphraseRemoved()).toEqual(expectedAction);
    });
  });
});
