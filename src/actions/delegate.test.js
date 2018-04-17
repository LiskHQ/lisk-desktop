import { expect } from 'chai';
import sinon from 'sinon';
import * as delegateApi from '../utils/api/delegate';
import actionTypes from '../constants/actions';

import {
  delegatesFetched,
} from './delegate';

/* eslint-disable mocha/no-exclusive-tests */
describe.only('actions: delegate', () => {
  let dispatch;
  let getDelegateStub;

  describe('delegatesFetched', () => {
    const activePeer = {};
    const username = 'username';
    const delegatesFetchedAction = delegatesFetched(activePeer, username);

    beforeEach(() => {
      getDelegateStub = sinon.stub(delegateApi, 'getDelegate');
      dispatch = sinon.spy();
    });

    afterEach(() => {
      getDelegateStub.restore();
    });

    it('should create actions to handle getDelegate response', () => {
      const responseData = { delegate: {} };
      getDelegateStub.returnsPromise().resolves({ ...responseData });
      const expectedActionDelegatesRetrieving = {
        type: actionTypes.delegatesRetrieving,
        data: {
        },
      };

      const expectedActionDelegatesRetrieved = {
        type: actionTypes.delegatesRetrieving,
        data: {
          ...responseData,
        },
      };
      delegatesFetchedAction(dispatch);
      expect(dispatch.getCall(0).args[0].data).to.have.been
        .deep.equal(expectedActionDelegatesRetrieving.data);
      expect(dispatch.getCall(0).args[0].type).to.have.been
        .deep.equal(expectedActionDelegatesRetrieving.type);
      expect(dispatch.getCall(1).args[0].data).to.have.been
        .deep.equal(expectedActionDelegatesRetrieved.data);
      expect(dispatch.getCall(1).args[0].type).to.have.been
        .deep.equal(expectedActionDelegatesRetrieved.type);
    });
  });
});
/* eslint-enable mocha/no-exclusive-tests */
