import { expect } from 'chai';
import { spy, stub } from 'sinon';
import middleware from './peers';
import actionTypes from '../../constants/actions';
import { activePeerSet } from '../../actions/peers';

describe('Peer middleware', () => {
  let store;
  let next;
  let localStorageStub;

  beforeEach(() => {
    next = spy();
    store = stub();
    localStorageStub = stub(localStorage, 'get');

    store.getState = () => ({
      peers: {
        data: {},
      },
      account: {},
    });
    store.dispatch = spy();
  });

  afterEach(() => {
    localStorageStub.restore();
  });

  it('should just pass action along', () => {
    localStorageStub.returns(JSON.stringify([]));

    const sampleAction = {
      type: 'SAMPLE_TYPE',
      data: 'SAMPLE_DATA',
    };
    middleware(store)(next)(sampleAction);
    expect(next).to.have.been.calledWith(sampleAction);
  });

  it('should dispatch activePeerSet if there are no saved accounts', () => {
    const storeCreated = { type: actionTypes.storeCreated };
    localStorageStub.returns(JSON.stringify([]));
    middleware(store)(next)(storeCreated);
    expect(store.dispatch).to.have.been.calledWith();
  });

  it('should not dispatch activePeerSet if there are saved accounts', () => {
    const storeCreated = { type: actionTypes.storeCreated };
    localStorageStub.returns(JSON.stringify([{}, {}]));
    middleware(store)(next)(storeCreated);
    expect(store.dispatch).to.not.have.been.calledWith(activePeerSet());
  });
});

