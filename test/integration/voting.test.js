import { step } from 'mocha-steps';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, match, spy } from 'sinon';
// import thunk from 'redux-thunk';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import GenericStepDefinition from '../utils/genericStepDefinition';
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
let helper;

/**
 * extend GenericStepDefinition and add some specific function to it for testing voting
 */
class Helper extends GenericStepDefinition {
  /**
   *
   * @param {String} index - index of the delegate in the list
   * @param {Boolean} value - new value of the input
   */
  voteToDelegates(index, value) {
    this.wrapper.find('.delegate-list input').at(index)
      .simulate('change', { target: { value } });
  }

  goToConfirmation() {
    expect(this.wrapper.find('button.confirm')).to.be.not.present();
    this.wrapper.find('button.next').simulate('click');
    expect(this.wrapper.find('button.confirm')).to.be.present();
  }
}

/**
 * required steps for login
 */
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

  voteApiStub.returnsPromise()
    .resolves({
      transactionId: 12341234123432412,
      account,
    });

  wrapper = mount(renderWithRouter(Voting, store, {
    history: {
      location: { search: '' },
      replace: spy(),
    },
  }));
  helper = new Helper(wrapper, store);
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

describe('@integration test of Voting', () => {
  describe('Scenario: should allow to select delegates in the "Voting" and vote for them', () => {
    step('I\'m logged in as "genesis"', loginProcess);
    step('And next button should be disabled', () => helper.checkDisableInput('button.next'));
    step('When I click checkbox on list item no. 0', () => helper.voteToDelegates(0, true));
    step('When I click checkbox on list item no. 1', () => helper.voteToDelegates(1, true));
    step('Then next button should be enabled', () => helper.checkDisableInput('button.next', 'not'));
    step('And selectionHeader should be equal to "2"', () => helper.haveTextOf('.selection h4', 2));
    step('Then I go to confirmation step', () => helper.goToConfirmation());
    step('When I click on confirm button', () => helper.clickOnElement('button.confirm'));
    step('Then I should see result box', () => helper.haveTextOf('h2.result-box-header', 'Votes submitted'));
    step('Then I click Okey button', () => helper.clickOnElement('button.okay-button'));
    step('And selectionHeader should be equal to "0"', () => helper.haveTextOf('.selection h4', 0));
    step('Then I restore Api mocks', restoreApiMocks);
  });

  describe('Scenario: should allow me to filter my votes', () => {
    step('I\'m logged in as "genesis"', () => loginProcess([delegates[0]]));
    step('And I should see 3 rows', () => helper.haveLengthOf('ul.delegate-row', 3));
    step('When I click filter-voted', () => helper.clickOnElement('li.filter-voted'));
    step('Then I should see 1 rows', () => helper.haveLengthOf('ul.delegate-row', 1));
    step('When I click filter-not-voted', () => helper.clickOnElement('li.filter-not-voted'));
    step('Then I should see 2 rows', () => helper.haveLengthOf('ul.delegate-row', 2));
    step('When I click filter-all', () => helper.clickOnElement('li.filter-all'));
    step('Then I should see all votes again', () => helper.haveLengthOf('ul.delegate-row', 3));
    step('Then I restore Api mocks', restoreApiMocks);
  });

  describe('Scenario: should allow to select delegates in the "Voting" and unvote them', () => {
    step('I\'m logged in as "genesis"', () => loginProcess([delegates[0]]));
    step('And next button should be disabled', () => helper.checkDisableInput('button.next'));
    step('When I click checkbox on list item no. 0', () => helper.voteToDelegates(0, false));
    step('Then next button should be enabled', () => helper.checkDisableInput('button.next', 'not'));
    step('And selectionHeader should be equal to "2"', () => helper.haveTextOf('.selection h4', 1));
    step('Then I go to confirmation step', () => helper.goToConfirmation());
    step('When I click on confirm button', () => helper.clickOnElement('button.confirm'));
    step('Then I should see result box', () => helper.haveTextOf('h2.result-box-header', 'Votes submitted'));
    step('Then I restore Api mocks', restoreApiMocks);
  });

  describe('Scenario: should allow to see all selected delegates in confirm step', () => {
    step('I\'m logged in as "genesis"', () => loginProcess([delegates[0]]));
    step('And next button should be disabled', () => helper.checkDisableInput('button.next'));
    step('And I click filter-voted', () => helper.clickOnElement('li.filter-voted'));
    step('And I click checkbox on list item no. 0', () => helper.voteToDelegates(0, false));
    step('And I click filter-not-voted', () => helper.clickOnElement('li.filter-not-voted'));
    step('And I click checkbox on list item no. 0', () => helper.voteToDelegates(0, true));
    step('Then next button should be enabled', () => helper.checkDisableInput('button.next', 'not'));
    step('When I go to confirmation step', () => helper.goToConfirmation());
    step('Then I should see all votes on confirmation step', () => helper.haveLengthOf('ul.selected-row', 2));
    step('Then I restore Api mocks', restoreApiMocks);
  });
});
