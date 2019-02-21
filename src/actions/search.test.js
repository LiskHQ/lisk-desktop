import { expect } from 'chai';
import { stub, match, spy } from 'sinon';
import actionTypes from '../constants/actions';
import * as searchAPI from '../utils/api/search';
import * as accountAPI from '../utils/api/account';
import * as delegateAPI from '../utils/api/delegate';
import {
  searchSuggestions,
  searchMoreVoters,
} from './search';


describe('actions: search', () => {
  let searchAllStub;
  let dispatch;
  let getState;

  beforeEach(() => {
    dispatch = spy();
    getState = stub().withArgs(match.any).returns({
      peers: {
        liskAPIClient: {},
      },
    });

    searchAllStub = stub(searchAPI, 'default');
    searchAllStub.withArgs(match.any).resolves({});
  });

  afterEach(() => {
    searchAllStub.restore();
  });

  it('should clear suggestions and search for {delegates,addresses,transactions}', () => {
    const data = { liskAPIClient: {}, searchTerm: '' };
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

  it('should call to searchMoreVoters no publicKey', () => {
    stub(accountAPI, 'getAccount').returnsPromise();

    // Case 1: return publicKey
    accountAPI.getAccount.resolves({ publicKey: null });

    const address = '123L';
    const offset = 0;
    const limit = 100;
    const action = searchMoreVoters({ address, offset, limit });
    action(dispatch, getState);
    expect(dispatch).to.not.have.been.calledWith();

    accountAPI.getAccount.restore();
  });

  it('should call to searchMoreVoters no publicKey offset or limit', () => {
    stub(accountAPI, 'getAccount').returnsPromise();

    // Case 1: return publicKey
    accountAPI.getAccount.resolves({ publicKey: null });

    const address = '123L';
    const action = searchMoreVoters({ address });
    action(dispatch, getState);
    expect(dispatch).to.not.have.been.calledWith();

    accountAPI.getAccount.restore();
  });

  it('should call to searchMoreVoters no offset or limit', () => {
    stub(accountAPI, 'getAccount').returnsPromise();
    stub(delegateAPI, 'getVoters');

    // Case 1: return publicKey
    const publicKey = 'my-key';
    accountAPI.getAccount.resolves({ publicKey });
    delegateAPI.getVoters.resolves({
      data: { voters: [] },
    });

    const address = '123L';
    const action = searchMoreVoters({ address });
    action(dispatch, getState);
    expect(dispatch).to.not.have.been.calledWith({
      type: actionTypes.searchVoters,
      data: {
        voters: [],
      },
    });

    delegateAPI.getVoters.restore();
    accountAPI.getAccount.restore();
  });
});
