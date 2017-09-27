import { expect } from 'chai';
import sinon from 'sinon';
import actionTypes from '../constants/actions';
import * as saveAccountUtils from '../utils/saveAccount';
import {
  accountSaved,
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
      sinon.stub(saveAccountUtils, 'getSavedAccount').returns([data]);
      const expectedAction = {
        data: [data],
        type: actionTypes.accountsRetrieved,
      };
      expect(accountsRetrieved()).to.be.deep.equal(expectedAction);
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
