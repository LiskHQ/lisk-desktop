import { expect } from 'chai';
import sinon from 'sinon';
import actionTypes from '../constants/actions';
import * as savedAccountsUtils from '../utils/savedAccounts';
import {
  accountSaved,
  accountSwitched,
  accountRemoved,
  accountsRetrieved,
} from './savedAccounts';


describe('actions: savedAccount', () => {
  const data = {
    publicKey: 'sample_key',
    network: 1,
    address: 'http://localhost:400',
  };

  describe('accountsRetrieved', () => {
    it('should create an action to retrieved the saved accounts list', () => {
      const getSavedAccountsStub = sinon.stub(savedAccountsUtils, 'getSavedAccounts').returns([data]);
      const getLastActiveAccountStub = sinon.stub(savedAccountsUtils, 'getLastActiveAccount').returns(data);
      const expectedAction = {
        data: {
          accounts: [data],
          lastActive: data,
        },
        type: actionTypes.accountsRetrieved,
      };
      expect(accountsRetrieved()).to.be.deep.equal(expectedAction);

      getSavedAccountsStub.restore();
      getLastActiveAccountStub.restore();
    });
  });

  describe('accountSaved', () => {
    it('should create an action to save account', () => {
      const expectedAction = {
        data,
        type: actionTypes.accountSaved,
      };
      expect(accountSaved(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('accountSwitched', () => {
    it('should create an action to save account', () => {
      const expectedAction = {
        data,
        type: actionTypes.accountSwitched,
      };
      expect(accountSwitched(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('accountRemoved', () => {
    it('should create an action to remove account', () => {
      const expectedAction = {
        data: data.publicKey,
        type: actionTypes.accountRemoved,
      };

      expect(accountRemoved(data.publicKey)).to.be.deep.equal(expectedAction);
    });
  });
});
