import Lisk from 'lisk-js';
import { expect } from 'chai';
import sinon, { spy, stub } from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import middleware from './login';
import actionTypes from '../../constants/actions';
import * as accountApi from '../../utils/api/account';
import * as delegateApi from '../../utils/api/delegate';

sinonStubPromise(sinon);

describe('Login middleware', () => {
  let store;
  let next;
  const passphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';
  const activePeer = Lisk.api({
    name: 'Custom Node',
    custom: true,
    address: 'http://localhost:4000',
    testnet: true,
    nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
  });
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

  it(`should action data to only have activePeer on ${actionTypes.activePeerSet} action`, () => {
    middleware(store)(next)(activePeerSetAction);
    expect(next).to.have.been.calledWith({
      type: actionTypes.activePeerSet,
      data: activePeer,
    });
  });

  it(`should fetch account and delegate info on ${actionTypes.activePeerSet} action (non delegate)`, () => {
    const accountApiMock = stub(accountApi, 'getAccount');
    const delegateApiMock = stub(delegateApi, 'getDelegate');
    accountApiMock.resolves({ success: true, balance: 0 });
    delegateApiMock.rejects({ success: false });
    middleware(store)(next)(activePeerSetAction);
    expect(next).to.have.been.calledWith();

    accountApiMock.restore();
    delegateApiMock.restore();
  });

  it(`should fetch account and delegate info on ${actionTypes.activePeerSet} action (delegate)`, () => {
    const accountApiMock = stub(accountApi, 'getAccount');
    const delegateApiMock = stub(delegateApi, 'getDelegate');
    accountApiMock.resolves({ success: true, balance: 0 });
    delegateApiMock.resolves({ success: true, delegate: { username: 'TEST' }, username: 'TEST' });
    middleware(store)(next)(activePeerSetAction);
    expect(next).to.have.been.calledWith();

    accountApiMock.restore();
    delegateApiMock.restore();
  });
});

