import { expect } from 'chai';
import { stub, match, spy } from 'sinon';
import actionTypes from '../constants/actions';
import * as searchAPI from '../utils/api/search';
import { getAccount } from '../utils/api/account';
import {
  searchSuggestions,
  searchMoreVoters,
} from './search';


describe('actions: search', () => {
  let searchAllStub;
  let getAccountStub;
  let dispatch;
  let getState;

  beforeEach(() => {
    dispatch = spy();
    getState = stub().withArgs(match.any).returns({
      peers: {
        data: {},
      },
    });
    getAccountStub = stub(getAccount, 'getAccount');
    getAccountStub.withArgs(match.any).returnsPromise().resolves({});

    searchAllStub = stub(searchAPI, 'default');
    searchAllStub.withArgs(match.any).returnsPromise().resolves({});
  });

  afterEach(() => {
    searchAllStub.restore();
    getAccountStub.restore();
  });

  it('should clear suggestions and search for {delegates,addresses,transactions}', () => {
    const data = { activePeer: {}, searchTerm: '' };
    const action = searchSuggestions(data);
    action(dispatch, getState);
    expect(dispatch).to.have.been.calledWith({
      data: {},
      type: actionTypes.searchClearSuggestions,
    });
    expect(dispatch).to.have.been.calledWith({
      data: {},
      type: actionTypes.searchSuggestions,
    });
  });

  it('should call to searchMoreVoters', () => {
    const address = '123L';
    const publicKey = 'test_public';
    const offset = 0;
    const limit = 100;
    const action = searchMoreVoters({
      address, publicKey, offset, limit,
    });
    action(dispatch, getState);
    expect(dispatch).to.have.been.calledWith({
      data: {},
      type: actionTypes.searchVoters,
    });
  });
});
