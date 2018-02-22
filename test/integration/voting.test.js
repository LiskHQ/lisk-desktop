import { step } from 'mocha-steps';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
// import thunk from 'redux-thunk';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import middleware from '../../src/store/middlewares';
import accounts from '../constants/accounts';
import actionTypes from '../../src/constants/actions';
import accountReducer from '../../src/store/reducers/account';
import votingReducer from '../../src/store/reducers/voting';
import peersReducer from '../../src/store/reducers/peers';
import { accountLoggedIn } from '../../src/actions/account';
import * as delegateApi from '../../src/utils/api/delegate';
import Voting from '../../src/components/voting';

const delegates = [
  {
    address: '10839494368003872009L',
    approval: 32.82,
    missedblocks: 658,
    producedblocks: 37236,
    productivity: 98.26,
    publicKey: 'b002f58531c074c7190714523eec08c48db8c7cfc0c943097db1a2e82ed87f84',
    rank: 1,
    rate: 1,
    username: 'thepool',
    vote: '3883699551759500',
  },
  {
    address: '14593474056247442712L',
    approval: 32.08,
    missedblocks: 283,
    producedblocks: 38035,
    productivity: 99.26,
    publicKey: 'ec111c8ad482445cfe83d811a7edd1f1d2765079c99d7d958cca1354740b7614',
    rank: 2,
    rate: 2,
    username: 'liskpool_com_01',
    vote: '3796476912180144',
  },
  {
    address: '13943256167405531820L',
    approval: 32.03,
    missedblocks: 164,
    producedblocks: 38088,
    productivity: 99.57,
    publicKey: '00de7d28ec3f55f42329667f08352d0d90faa3d2d4e62c883d86d1d7b083dd7c',
    rank: 3,
    rate: 3,
    username: 'iii.element.iii',
    vote: '3789594637157356',
  },
];

const realAccount = {
  ...accounts.genesis,
  delegate: {},
  multisignatures: [],
  u_multisignatures: [],
  unconfirmedBalance: '0',
};

const peers = {
  defaultPeers: [
    'node01.lisk.io',
    'node02.lisk.io',
  ],
  defaultSSLPeers: [
    'node01.lisk.io',
    'node02.lisk.io',
  ],
  defaultTestnetPeers: [
    'testnet.lisk.io',
  ],
  options: {
    name: 'Testnet',
    testnet: true,
    ssl: true,
    port: 443,
    code: 1,
  },
  ssl: true,
  randomPeer: true,
  testnet: true,
  bannedPeers: [],
  currentPeer: 'testnet.lisk.io',
  port: 443,
  nethash: {
    'Content-Type': 'application/json',
    nethash: 'da3ed6a45429278bac2666961289ca17ad86595d33b31037615d4b8e8f158bba',
    broadhash: 'da3ed6a45429278bac2666961289ca17ad86595d33b31037615d4b8e8f158bba',
    os: 'lisk-js-api',
    version: '1.0.0',
    minVersion: '>=0.5.0',
    port: 443,
  },
};

describe('@integration test of Voting', () => {
  let store;
  let wrapper;
  let clock;


  let listDelegatesApiStub;
  let listAccountDelegatesStub;

  beforeEach(() => {
    listDelegatesApiStub = sinon.stub(delegateApi, 'listDelegates');
    listAccountDelegatesStub = sinon.stub(delegateApi, 'listAccountDelegates');
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
  });
  afterEach(() => {
    listDelegatesApiStub.restore();
    listAccountDelegatesStub.restore();
    clock.restore();
  });
  step('Given user is login in', () => {
    store = prepareStore({
      account: accountReducer,
      voting: votingReducer,
      peers: peersReducer,
    }, middleware);

    store.dispatch(accountLoggedIn(realAccount));
    store.dispatch({
      data: peers,
      type: actionTypes.activePeerSet,
    });
    listDelegatesApiStub.returnsPromise()
      .resolves({ delegates, success: true, totalCount: 20 });
    listAccountDelegatesStub.returnsPromise()
      .resolves({ delegates: [delegates[0]], success: true });

    wrapper = mount(renderWithRouter(Voting, store));
    expect(store.getState().account).to.be.an('Object');
    expect(store.getState().voting).to.be.an('Object');
    expect(store.getState().peers).to.be.an('Object');
  });

  step('When user doesn\'t vote to any delegates next button should be disabled', () => {
    expect(wrapper.find('button.next').props().disabled).to.be.equal(true);
  });
});
