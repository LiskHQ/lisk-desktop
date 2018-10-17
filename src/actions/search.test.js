import { expect } from 'chai';
import { stub, match, spy } from 'sinon';
import actionTypes from '../constants/actions';
import * as searchAPI from '../utils/api/search';
import * as accountApi from '../utils/api/account';
import {
  searchSuggestions,
  searchMoreVoters,
  searchVoters,
} from './search';


describe('actions: search', () => {
  let searchAllStub;
  let dispatch;
  let getState;

  beforeEach(() => {
    dispatch = spy();
    getState = stub().withArgs(match.any).returns({
      peers: {
        data: {},
      },
    });

    searchAllStub = stub(searchAPI, 'default');
    searchAllStub.withArgs(match.any).returnsPromise().resolves({});
  });

  afterEach(() => {
    searchAllStub.restore();
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
    stub(accountApi, 'getAccount').returnsPromise();

    // Case 1: return publicKey
    accountApi.getAccount.resolves({ publicKey: null });

    const address = '123L';
    const offset = 0;
    const limit = 100;
    const action = searchMoreVoters({ address, offset, limit });
    action(dispatch, getState);
    expect(dispatch).to.not.have.been.calledWith();

    // Case 2: balance does change
    // accountApi.getAccount.resolves({ publicKey: 'my-key' });

    // searchMoreVoters({ address, offset, limit })(dispatch, getState);
    // expect(dispatch).to.been.calledWith(searchVoters({
    //   address,
    //   publicKey,
    //   offset,
    //   limit,
    // }));

    accountApi.getAccount.restore();
  });
});
