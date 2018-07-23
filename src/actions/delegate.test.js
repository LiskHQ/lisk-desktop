import { expect } from 'chai';
import sinon from 'sinon';
import * as delegateApi from '../utils/api/delegate';

import {
  delegatesRetrieving,
  delegatesRetrieved,
  delegatesFetched,
} from './delegate';

describe('actions: delegate', () => {
  let dispatch;
  let getDelegateStub;

  describe('delegatesFetched', () => {
    const activePeer = {};
    const username = 'username';
    const delegatesFetchedAction = delegatesFetched({ activePeer, username });

    beforeEach(() => {
      getDelegateStub = sinon.stub(delegateApi, 'getDelegate');
      dispatch = sinon.spy();
    });

    afterEach(() => {
      getDelegateStub.restore();
    });

    it('should create actions to handle getDelegate response', () => {
      const responseData = { delegate: {} };
      getDelegateStub.returnsPromise().resolves({ data: [{ ...responseData }] });

      const expectedActionDelegatesRetrieved = {
        delegate: responseData,
        username,
      };
      delegatesFetchedAction(dispatch);
      expect(dispatch).to.have.been
        .calledWith(delegatesRetrieving());
      expect(dispatch).to.have.been
        .calledWith(delegatesRetrieved(expectedActionDelegatesRetrieved));
    });

    it('should create actions to handle getDelegate response failure', () => {
      const responseData = { delegate: null };
      getDelegateStub.returnsPromise().resolves({ data: [] });

      const expectedActionDelegatesRetrieved = {
        ...responseData,
        username,
      };
      delegatesFetchedAction(dispatch);
      expect(dispatch).to.have.been
        .calledWith(delegatesRetrieving());
      expect(dispatch).to.have.been
        .calledWith(delegatesRetrieved(expectedActionDelegatesRetrieved));
    });
  });
});
