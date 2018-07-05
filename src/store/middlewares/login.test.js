import { expect } from 'chai';
import { spy, stub } from 'sinon';
import Lisk from 'lisk-elements';
import accounts from '../../../test/constants/accounts';
import middleware from './login';
import actionTypes from '../../constants/actions';
import * as accountApi from '../../utils/api/account';
import * as delegateApi from '../../utils/api/delegate';

describe('Login middleware', () => {
  let store;
  let next;
  let accountApiMock;
  let delegateApiMock;
  let APIClientBackup;
  let getConstantsMock;
  let activePeerSetAction;
  const { passphrase } = accounts.genesis;
  const nethash = '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d';

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

    APIClientBackup = Lisk.APIClient;
    getConstantsMock = stub().returnsPromise();

    // TODO: find a better way of mocking Lisk.APIClient
    Lisk.APIClient = class MockAPIClient {
      constructor() {
        this.node = {
          getConstants: getConstantsMock,
        };
      }
    };
    Lisk.APIClient.constants = APIClientBackup.constants;

    activePeerSetAction = {
      type: actionTypes.activePeerSet,
      data: {
        passphrase,
        activePeer: Lisk.APIClient,
      },
    };

    getConstantsMock.resolves({ data: { nethash } });
  });

  afterEach(() => {
    accountApiMock.restore();
    delegateApiMock.restore();
    Lisk.APIClient = APIClientBackup;
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
      data: {
        passphrase,
        activePeer: Lisk.APIClient,
      },
    });
  });

  it(`should fetch account and delegate info on ${actionTypes.activePeerSet} action (non delegate)`, () => {
    accountApiMock.resolves({ success: true, data: { balance: 0 } });
    delegateApiMock.rejects({ success: false });

    middleware(store)(next)(activePeerSetAction);
    expect(store.dispatch).to.have.been.calledWith();
  });

  it(`should fetch account and delegate info on ${actionTypes.activePeerSet} action (delegate)`, () => {
    accountApiMock.resolves({ success: true, data: { balance: 0 } });
    delegateApiMock.resolves({
      success: true,
      delegate: { username: 'TEST' },
      username: 'TEST',
    });

    middleware(store)(next)(activePeerSetAction);
    expect(store.dispatch).to.have.been.calledWith();
  });
});

