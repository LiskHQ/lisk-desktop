import { expect } from 'chai';
import { stub, match, spy } from 'sinon';
import actionTypes from '../constants/actions';
import * as searchAPI from '../utils/api/search';
import {
  searchSuggestions,
} from './search';


describe('actions: search', () => {
  let searchAllStub;
  let dispatch;

  beforeEach(() => {
    dispatch = spy();
    searchAllStub = stub(searchAPI, 'default');
    searchAllStub.withArgs(match.any).returnsPromise().resolves({});
  });

  afterEach(() => {
    searchAllStub.restore();
  });

  it('should clear suggestions and search for {delegates,addresses,transactions}', () => {
    const data = { activePeer: {}, searchTerm: '' };
    const action = searchSuggestions(data);
    action(dispatch);
    expect(dispatch).to.have.been.calledWith({
      data: {},
      type: actionTypes.searchClearSuggestions,
    });
    expect(dispatch).to.have.been.calledWith({
      data: {},
      type: actionTypes.searchSuggestions,
    });
  });
});
