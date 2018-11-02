import { expect } from 'chai';
import { spy, stub } from 'sinon';
import middleware from './peers';
import actionTypes from '../../constants/actions';
import { activePeerSet } from '../../actions/peers';
import * as loginUtils from './../../utils/login';

describe('Peer middleware', () => {
  let store;
  let next;
  let localStorageStub;
  let loginUtilsStub;
  let getAutoLogInDataStub;

  beforeEach(() => {
    next = spy();
    store = stub();
    localStorageStub = stub(localStorage, 'get');
    loginUtilsStub = stub(loginUtils, 'findMatchingLoginNetwork');
    getAutoLogInDataStub = stub(loginUtils, 'getAutoLogInData');

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
    loginUtilsStub.restore();
    getAutoLogInDataStub.restore();
  });

  it('should just pass action along', () => {
    localStorageStub.returns(JSON.stringify([]));
    getAutoLogInDataStub.returns({
      liskCoreUrl: 'https://testnet.lisk.io',
    });
    const sampleAction = {
      type: 'SAMPLE_TYPE',
      data: 'SAMPLE_DATA',
    };
    middleware(store)(next)(sampleAction);
    expect(next).to.have.been.calledWith(sampleAction);
  });

  it('should get the correct network', () => {
    getAutoLogInDataStub.returns({
      liskCoreUrl: 'https://testnet.lisk.io',
    });
    loginUtilsStub.returns();
    const storeCreated = { type: actionTypes.storeCreated };
    localStorageStub.returns(JSON.stringify([]));
    middleware(store)(next)(storeCreated);
    expect(store.dispatch).to.have.been.calledWith();
  });

  it('should auto login without shouldAutoLogIn', () => {
    getAutoLogInDataStub.returns({
      liskCoreUrl: undefined,
    });
    loginUtilsStub.returns();
    const storeCreated = { type: actionTypes.storeCreated };
    localStorageStub.returns(JSON.stringify([]));
    middleware(store)(next)(storeCreated);
    expect(store.dispatch).to.have.been.calledWith();
  });

  it('should dispatch activePeerSet if there are no saved accounts', () => {
    const storeCreated = { type: actionTypes.storeCreated };
    localStorageStub.returns(JSON.stringify([]));
    getAutoLogInDataStub.returns({
      liskCoreUrl: 'https://testnet.lisk.io',
    });
    middleware(store)(next)(storeCreated);
    expect(store.dispatch).to.have.been.calledWith();
  });

  it('should not dispatch activePeerSet if there are saved accounts', () => {
    const storeCreated = { type: actionTypes.storeCreated };
    localStorageStub.returns(JSON.stringify([{}, {}]));
    getAutoLogInDataStub.returns({
      liskCoreUrl: 'https://testnet.lisk.io',
    });
    middleware(store)(next)(storeCreated);
    expect(store.dispatch).to.not.have.been.calledWith(activePeerSet());
  });
});

