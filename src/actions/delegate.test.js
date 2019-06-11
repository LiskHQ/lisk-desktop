import { expect } from 'chai';
import sinon from 'sinon';
import * as delegateApi from '../utils/api/delegates';

import {
  delegateRetrieving,
  delegateRetrieved,
  delegatesFetched,
} from './delegate';

describe('actions: delegate', () => {
  let dispatch;
  let getDelegatesStub;
  let getState;

  describe('delegatesFetched', () => {
    const username = 'username';
    const delegatesFetchedAction = delegatesFetched({ username });

    beforeEach(() => {
      getDelegatesStub = sinon.stub(delegateApi, 'getDelegates');
      dispatch = sinon.spy();
      getState = () => ({
        peers: { liskAPIClient: {} },
      });
    });

    afterEach(() => {
      getDelegatesStub.restore();
    });

    it('should create actions to handle getDelegates response', () => {
      const responseData = { delegate: {} };
      getDelegatesStub.returnsPromise().resolves({ data: [{ ...responseData }] });

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

    it('should create actions to handle getDelegates response failure', () => {
      const responseData = { delegate: null };
      getDelegatesStub.returnsPromise().resolves({ data: [] });

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
