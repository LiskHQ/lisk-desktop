import { expect } from 'chai';
import { spy, stub } from 'sinon';
import middleware from './notification';
import actionTypes from '../../constants/actions';
import Notification from '../../utils/notification';

describe('Notification middleware', () => {
  let store;
  let next;
  const accountUpdatedAction = balance => ({
    type: actionTypes.accountUpdated,
    data: {
      balance,
    },
  });

  beforeEach(() => {
    next = spy();
    store = stub();
    store.getState = () => ({
      account: {
        balance: 100,
      },
    });
    store.dispatch = spy();
  });

  it('should init Notification service', () => {
    const spyFn = spy(Notification, 'init');
    middleware(store);
    expect(spyFn).to.have.been.calledWith();
    spyFn.restore();
  });

  it('should just pass action along for all actions', () => {
    const sampleAction = {
      type: 'SAMPLE_TYPE',
      data: 'SAMPLE_DATA',
    };
    middleware(store)(next)(sampleAction);
    expect(next).to.have.been.calledWith(sampleAction);
  });

  it(`should handle notify.about method on ${actionTypes.accountUpdated} action`, () => {
    const spyFn = spy(Notification, 'about');
    middleware(store)(next)(accountUpdatedAction(1000));
    expect(spyFn).to.have.been.calledWith('deposit', 900);
    spyFn.restore();
  });

  it(`should not handle notify.about method on ${actionTypes.accountUpdated} action if balance the same or lower than current`, () => {
    const spyFn = spy(Notification, 'about');
    middleware(store)(next)(accountUpdatedAction(100));
    middleware(store)(next)(accountUpdatedAction(50));
    expect(spyFn.called).to.be.equal(false);
    spyFn.restore();
  });
});

