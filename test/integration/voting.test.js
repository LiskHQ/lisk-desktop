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

/**
 * restore all Api mocks
 */
const restoreApiMocks = () => {
  listDelegatesApiStub.restore();
  listAccountDelegatesStub.restore();
  voteApiStub.restore();
  accountAPIStub.restore();
  localStorageStub.restore();
};

/**
 * 
 * @param {string} index - index of the delegate in the list
 * @param {boolean} value - new value of the input
 */
const voteToDelegates = (index, value) => {
  wrapper.find('.delegate-list input').at(index)
    .simulate('change', { target: { value } });
};

const goToConfirmation = () => {
  expect(wrapper.find('button.confirm')).to.be.not.present();
  wrapper.find('button.next').simulate('click');
  expect(wrapper.find('button.confirm')).to.be.present();
};

describe('@integration test of Voting', () => {
  describe('Scenario: should allow to select delegates in the "Voting" and vote for them', () => {
    step('I\'m logged in as "genesis"', () => { loginProcess(); });

    step('And next button should be disabled', () => {
      expect(wrapper.find('button.next')).to.have.prop('disabled', true);
    });

    step('When I vote to delegates and next button should be enabled', () => {
      voteToDelegates(0, true);
      voteToDelegates(1, true);
    });

    step('Then next button should be enabled', () => {
      expect(wrapper.find('button.next')).to.have.prop('disabled', false);
    });

    step('And selectionHeader should be equal to "2"', () => {
      const selectionHeader = wrapper.find('.selection h4');
      expect(selectionHeader).to.have.text('2');
    });

    step('Then I go to confirmation step', () => { goToConfirmation(); });

    step('When I click on confirm button', () => {
      voteApiStub.returnsPromise()
        .resolves({
          transactionId: 12341234123432412,
          account,
        });
      wrapper.find('button.confirm').simulate('click');
    });

    step('Then I should see result box', () => {
      const expectedValue = 'Votes submitted';
      expect(wrapper.find('h2.result-box-header')).to.have.text(expectedValue);
      expect(wrapper.find('p.result-box-message')).to.be.present();
      restoreApiMocks();
    });
  });

  describe('Scenario: should allow me to filter my votes', () => {
    step('I\'m logged in as "genesis"', () => { loginProcess([delegates[0]]); });

    step('And I should see 3 rows', () => {
      expect(wrapper.find('ul.delegate-row')).to.have.lengthOf(3);
    });

    step('When I click filter-voted', () => {
      wrapper.find('li.filter-voted').simulate('click');
    });

    step('Then I should see 1 rows', () => {
      expect(wrapper.find('ul.delegate-row')).to.have.lengthOf(1);
    });

    step('When I click filter-not-voted', () => {
      wrapper.find('li.filter-not-voted').simulate('click');
    });

    step('Then I should see 2 rows', () => {
      expect(wrapper.find('ul.delegate-row')).to.have.lengthOf(2);
    });

    step('When I click filter-all I should see all votes again', () => {
      wrapper.find('li.filter-all').simulate('click');
    });

    step('Then I should see all votes again', () => {
      expect(wrapper.find('ul.delegate-row')).to.have.lengthOf(3);
      restoreApiMocks();
    });
  });

  describe('Scenario: should allow to select delegates in the "Voting" and unvote them', () => {
    step('I\'m logged in as "genesis"', () => { loginProcess([delegates[0]]); });

    step('And next button should be disabled', () => {
      expect(wrapper.find('button.next')).to.have.prop('disabled', true);
    });

    step('When I remove my vote', () => {
      voteToDelegates(0, false);
    });

    step('Then next button should be enabled', () => {
      expect(wrapper.find('button.next')).to.have.prop('disabled', false);
    });

    step('And selectionHeader should be equal to "1"', () => {
      const selectionHeader = wrapper.find('.selection h4');
      expect(selectionHeader).to.have.text('1');
    });

    step('Then I go to confirmation step', () => { goToConfirmation(); });

    step('When I click on confirm button', () => {
      voteApiStub.returnsPromise()
        .resolves({
          transactionId: 12341234123432412,
          account,
        });
      wrapper.find('button.confirm').simulate('click');
    });

    step('Then I should see result box', () => {
      const expectedValue = 'Votes submitted';
      expect(wrapper.find('h2.result-box-header')).to.have.text(expectedValue);
      expect(wrapper.find('p.result-box-message')).to.be.present();
      restoreApiMocks();
    });
  });
});
