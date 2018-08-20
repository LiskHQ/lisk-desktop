import { expect } from 'chai';
import sinon from 'sinon';
import * as delegateApi from '../utils/api/delegate';

import {
  delegateRetrieving,
  delegateRetrieved,
  delegatesFetched,
} from './delegate';

describe('actions: delegate', () => {
  let dispatch;
  let getDelegateStub;
  let getState;

  describe('delegatesFetched', () => {
    const username = 'username';
    const delegatesFetchedAction = delegatesFetched({ username });

    beforeEach(() => {
      getDelegateStub = sinon.stub(delegateApi, 'getDelegate');
      dispatch = sinon.spy();
      getState = () => ({
        peers: { data: {} },
      });
    });

    afterEach(() => {
      getDelegateStub.restore();
    });

    it('should create actions to handle getDelegate response', () => {
      const responseData = { delegate: {} };
      getDelegateStub.returnsPromise().resolves({ data: [{ ...responseData }] });

      const expectedActionDelegateRetrieved = {
        delegate: responseData,
        username,
      };
      delegatesFetchedAction(dispatch, getState);
      expect(dispatch).to.have.been
        .calledWith(delegateRetrieving());
      expect(dispatch).to.have.been
        .calledWith(delegateRetrieved(expectedActionDelegateRetrieved));
    });

    it('should create actions to handle getDelegate response failure', () => {
      const responseData = { delegate: null };
      getDelegateStub.returnsPromise().resolves({ data: [] });

      const expectedActionDelegateRetrieved = {
        ...responseData,
        username,
      };
      delegatesFetchedAction(dispatch, getState);
      expect(dispatch).to.have.been
        .calledWith(delegateRetrieving());
      expect(dispatch).to.have.been
        .calledWith(delegateRetrieved(expectedActionDelegateRetrieved));
    });
  });
});
