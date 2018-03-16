import { expect } from 'chai';
import { spy, stub } from 'sinon';
import accounts from '../../../test/constants/accounts';
import middleware from './login';
import actionTypes from '../../constants/actions';
import * as accountApi from '../../utils/api/account';
import * as delegateApi from '../../utils/api/delegate';
import networks from '../../constants/networks';

describe('Login middleware', () => {
  let store;
  let next;
  let accountApiMock;
  let delegateApiMock;
  const { passphrase } = accounts.genesis;
  const activePeer = { options: { code: networks.mainnet } };
  const activePeerSetAction = {
    type: actionTypes.activePeerSet,
    data: {
      passphrase,
      activePeer,
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
      settings: { autoLog: true },
    });
    store.dispatch = spy();

    accountApiMock = stub(accountApi, 'getAccount').returnsPromise();
    delegateApiMock = stub(delegateApi, 'getDelegate').returnsPromise();
  });

  afterEach(() => {
    accountApiMock.restore();
    delegateApiMock.restore();
  });

  it(`should just pass action along for all actions except ${actionTypes.activePeerSet}`, () => {
    const sampleAction = {
      type: 'SAMPLE_TYPE',
      data: 'SAMPLE_DATA',
    };
    middleware(store)(next)(sampleAction);
    expect(next).to.have.been.calledWith(sampleAction);
  });

  it(`should action data to only have activePeer on ${actionTypes.activePeerSet} action`, () => {
    middleware(store)(next)(activePeerSetAction);
    expect(next).to.have.been.calledWith({
      type: actionTypes.activePeerSet,
      data: activePeer,
    });
  });

  it(`should fetch account and delegate info on ${actionTypes.activePeerSet} action (non delegate)`, () => {
    accountApiMock.resolves({ success: true, balance: 0 });
    delegateApiMock.rejects({ success: false });

    middleware(store)(next)(activePeerSetAction);
    expect(store.dispatch).to.have.been.calledWith();
  });

  it(`should fetch account and delegate info on ${actionTypes.activePeerSet} action (delegate)`, () => {
    accountApiMock.resolves({ success: true, balance: 0 });
    delegateApiMock.resolves({
      success: true,
      delegate: { username: 'TEST' },
      username: 'TEST',
    });

    middleware(store)(next)(activePeerSetAction);
    expect(store.dispatch).to.have.been.calledWith();
  });
});

