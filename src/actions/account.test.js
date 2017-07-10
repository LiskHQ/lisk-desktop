import { expect } from 'chai';
import actionTypes from '../constants/actions';
import { accountUpdated, accountLoggedOut } from './account';

describe('actions', () => {
  it('should create an action to set values to account', () => {
    const data = {
      passphrase: 'robust swift grocery peasant forget share enable convince deputy road keep cheap',
    };

    const expectedAction = {
      data,
      type: actionTypes.accountUpdated,
    };
    expect(accountUpdated(data)).to.be.deep.equal(expectedAction);
  });

  it('should create an action to reset the account', () => {
    const expectedAction = {
      type: actionTypes.accountLoggedOut,
    };
    expect(accountLoggedOut()).to.be.deep.equal(expectedAction);
  });
});
