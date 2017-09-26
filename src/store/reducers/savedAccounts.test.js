import { expect } from 'chai';
import savedAccounts from './savedAccounts';
import actionTypes from '../../constants/actions';

describe('Reducer: savedAccounts(state, action)', () => {
  const account = {
    publicKey: 'sample_key_1',
    network: 'Custom node',
    address: 'http://localhost:4000',
  };
  const account2 = {
    publicKey: 'sample_key_2',
    network: 'Custom node',
    address: 'http://localhost:4000',
  };
  it('should return action.data if action.type = actionTypes.accountsRetrieved', () => {
    const state = [];
    const action = {
      type: actionTypes.accountsRetrieved,
      data: [account, account2],
    };
    const expectedSate = [account, account2];
    const changedState = savedAccounts(state, action);
    expect(changedState).to.deep.equal(expectedSate);
  });

  it('should return action.data with address if action.type = actionTypes.accountSaved', () => {
    const state = [];
    const action = {
      type: actionTypes.accountSaved,
      data: account,
    };
    const changedState = savedAccounts(state, action);
    expect(changedState).to.deep.equal([action.data]);
  });

  it('should return array without given account if action.type = actionTypes.accountRemoved', () => {
    const publicKey = 'sample_key_1';
    const state = [account];
    const action = {
      type: actionTypes.accountRemoved,
      data: publicKey,
    };
    const changedState = savedAccounts(state, action);
    expect(changedState).to.deep.equal([]);
  });
});

