import { expect } from 'chai';
import { spy, stub } from 'sinon';
import middleware from './delegateRegistration';
import actionTypes from '../../constants/actions';
import * as delegateApi from '../../utils/api/delegate';
import transactionTypes from '../../constants/transactionTypes';

describe('Login middleware', () => {
  let store;
  let next;
  const transactionsUpdatedAction = {
    type: actionTypes.transactionsUpdated,
    data: {
      confirmed: [{
        type: transactionTypes.registerDelegate,
      }],
    },
  };

  beforeEach(() => {
    next = spy();
    store = stub();
    store.getState = () => ({
      peers: {
        data: {},
      },
      account: {},
    });
    store.dispatch = spy();
  });

  it(`should just pass action along for all actions except ${actionTypes.activePeerSet}`, () => {
    const sampleAction = {
      type: 'SAMPLE_TYPE',
      data: 'SAMPLE_DATA',
    };
    middleware(store)(next)(sampleAction);
    expect(next).to.have.been.calledWith(sampleAction);
  });

  it(`should fetch delegate info on ${actionTypes.transactionsUpdated} action if action.data.confirmed contains delegateRegistration transactions`, () => {
    const delegateApiMock = stub(delegateApi, 'getDelegate').returnsPromise().resolves({ success: true, delegate: {} });

    middleware(store)(next)(transactionsUpdatedAction);
    expect(store.dispatch).to.have.been.calledWith();

    delegateApiMock.restore();
  });

  it(`should not fetch delegate info on ${actionTypes.transactionsUpdated} action if action.data.confirmed does not contain delegateRegistration transactions`, () => {
    const delegateApiMock = stub(delegateApi, 'getDelegate').returnsPromise().resolves({ success: true, delegate: {} });
    transactionsUpdatedAction.data.confirmed[0].type = transactionTypes.send;

    middleware(store)(next)(transactionsUpdatedAction);
    expect(store.dispatch).to.not.have.been.calledWith();

    delegateApiMock.restore();
  });
});
