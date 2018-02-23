import { step } from 'mocha-steps';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, match } from 'sinon';
// import thunk from 'redux-thunk';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import accounts from '../constants/accounts';
import transactionReducer from '../../src/store/reducers/transactions';
import accountReducer from '../../src/store/reducers/account';
import votingReducer from '../../src/store/reducers/voting';
import { accountLoggedIn } from '../../src/actions/account';
import * as delegateApi from '../../src/utils/api/delegate';
import * as accountAPI from '../../src/utils/api/account';
import Voting from '../../src/components/voting';
import peersReducer from '../../src/store/reducers/peers';
import loginMiddleware from '../../src/store/middlewares/login';
import accountMiddleware from '../../src/store/middlewares/account';
import peerMiddleware from '../../src/store/middlewares/peers';
import transactionsMiddleware from '../../src/store/middlewares/transactions';
import { activePeerSet } from '../../src/actions/peers';
import networks from './../../src/constants/networks';
import getNetwork from './../../src/utils/getNetwork';

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

const account = {
  ...accounts.genesis,
  delegate: {},
  multisignatures: [],
  u_multisignatures: [],
  unconfirmedBalance: '0',
};

let store;
let wrapper;
let listDelegatesApiStub;
let listAccountDelegatesStub;
let voteApiStub;
let accountAPIStub;
let localStorageStub;

const loginProcess = (votes = []) => {
  accountAPIStub = stub(accountAPI, 'getAccount');
  localStorageStub = stub(localStorage, 'getItem');
  localStorageStub.withArgs('accounts').returns(JSON.stringify([{}, {}]));
  listDelegatesApiStub = stub(delegateApi, 'listDelegates');
  listAccountDelegatesStub = stub(delegateApi, 'listAccountDelegates');
  voteApiStub = stub(delegateApi, 'vote');
  store = prepareStore({
    account: accountReducer,
    peers: peersReducer,
    voting: votingReducer,
    transactions: transactionReducer,
  }, [
    thunk,
    accountMiddleware,
    loginMiddleware,
    transactionsMiddleware,
    peerMiddleware,
  ]);

  accountAPIStub.withArgs(match.any).returnsPromise().resolves({ ...account });
  store.dispatch(activePeerSet({ network: getNetwork(networks.mainnet.code) }));
  accountAPIStub.withArgs(match.any).returnsPromise().resolves({ ...account });
  store.dispatch(accountLoggedIn(account));

  listDelegatesApiStub.returnsPromise()
    .resolves({ delegates, success: true, totalCount: 20 });
  listAccountDelegatesStub.returnsPromise()
    .resolves({ delegates: votes, success: true });

  wrapper = mount(renderWithRouter(Voting, store));
  expect(store.getState().account).to.be.an('Object');
  expect(store.getState().voting).to.be.an('Object');
  expect(store.getState().peers).to.be.an('Object');
};

const restoreApiMocks = () => {
  listDelegatesApiStub.restore();
  listAccountDelegatesStub.restore();
  voteApiStub.restore();
  accountAPIStub.restore();
  localStorageStub.restore();
};

describe('@integration test of Voting', () => {
  describe('Scenario: should allow to select delegates in the "Voting" and vote for them', () => {
    step('I\'m logged in as "genesis"', () => { loginProcess(); });

    step('And next button should be disabled', () => {
      expect(wrapper.find('button.next').props().disabled).to.be.equal(true);
    });

    step('When I vote to delegates and next button should be enabled', () => {
      wrapper.find('.delegate-list input').at(0).simulate('change', { target: { value: 'true' } });
      wrapper.find('.delegate-list input').at(1).simulate('change', { target: { value: 'true' } });
      const selectionHeader = wrapper.find('.selection h4').text();
      expect(selectionHeader).to.be.equal('2');
      expect(wrapper.find('button.next').props().disabled).to.be.equal(false);
    });

    step('Then I must be able to go to next step', () => {
      expect(wrapper.find('button.confirm').exists()).to.be.equal(false);
      wrapper.find('button.next').simulate('click');
      expect(wrapper.find('button.confirm').exists()).to.be.equal(true);
    });

    step('Then I confirm my votes', () => {
      const expectedValue = 'Votes submitted';
      voteApiStub.returnsPromise()
        .resolves({
          transactionId: 12341234123432412,
          account,
        });
      wrapper.find('button.confirm').simulate('click');
      expect(wrapper.find('h2.result-box-header').text()).to.be.equal(expectedValue);
      expect(wrapper.find('p.result-box-message').exists()).to.be.equal(true);
      restoreApiMocks();
    });
  });

  describe('Scenario: should allow me to filter my votes', () => {
    step('I\'m logged in as "genesis"', () => { loginProcess([delegates[0]]); });

    step('And I should see 3 rows', () => {
      expect(wrapper.find('ul.delegate-row')).to.have.lengthOf(3);
    });

    step('When I click filter-voted I should see 1 rows', () => {
      wrapper.find('li.filter-voted').simulate('click');
      expect(wrapper.find('ul.delegate-row')).to.have.lengthOf(1);
    });

    step('When I click filter-not-voted I should see 2 rows', () => {
      wrapper.find('li.filter-not-voted').simulate('click');
      expect(wrapper.find('ul.delegate-row')).to.have.lengthOf(2);
    });

    step('When I click filter-all I should see all votes again', () => {
      wrapper.find('li.filter-all').simulate('click');
      expect(wrapper.find('ul.delegate-row')).to.have.lengthOf(3);
      restoreApiMocks();
    });
  });

  describe('Scenario: should allow to select delegates in the "Voting" and unvote them', () => {
    step('I\'m logged in as "genesis"', () => { loginProcess([delegates[0]]); });

    step('And next button should be disabled', () => {
      expect(wrapper.find('button.next').props().disabled).to.be.equal(true);
    });

    step('When I remove my vote my delegates and next button should be enabled', () => {
      wrapper.find('.delegate-list input').at(0).simulate('change', { target: { value: 'false' } });
      const selectionHeader = wrapper.find('.selection h4').text();
      expect(selectionHeader).to.be.equal('1');
      expect(wrapper.find('button.next').props().disabled).to.be.equal(false);
    });

    step('Then I must be able to go to next step', () => {
      expect(wrapper.find('button.confirm').exists()).to.be.equal(false);
      wrapper.find('button.next').simulate('click');
      expect(wrapper.find('button.confirm').exists()).to.be.equal(true);
    });

    step('Then I confirm my votes', () => {
      const expectedValue = 'Votes submitted';
      voteApiStub.returnsPromise()
        .resolves({
          transactionId: 12341234123432412,
          account,
        });
      wrapper.find('button.confirm').simulate('click');
      expect(wrapper.find('h2.result-box-header').text()).to.be.equal(expectedValue);
      expect(wrapper.find('p.result-box-message').exists()).to.be.equal(true);
      restoreApiMocks();
    });
  });
});
