import thunk from 'redux-thunk';
import { step } from 'mocha-steps';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, match } from 'sinon';

import * as accountAPI from '../../src/utils/api/account';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import accountReducer from '../../src/store/reducers/account';
import peersReducer from '../../src/store/reducers/peers';
import loginMiddleware from '../../src/store/middlewares/login';
import accountMiddleware from '../../src/store/middlewares/account';
import { activePeerSet } from '../../src/actions/peers';
import networks from './../../src/constants/networks';
import getNetwork from './../../src/utils/getNetwork';
import { accountLoggedIn } from '../../src/actions/account';
import DelegateStatistics from './../../src/components/transactions/delegateStatistics';
import accounts from '../constants/accounts';
import GenericStepDefinition from '../utils/genericStepDefinition';

class Helper extends GenericStepDefinition {
  checkDetails() {
    expect(this.wrapper.find('.approval').first().text()).to.contain('30');
    expect(this.wrapper.find('.rank').first().text()).to.contain('10');
    expect(this.wrapper.find('.productivity').first().text()).to.contain('10');
  }

  countLinks(expectedNumber) {
    expect(this.wrapper.find('.voters Link')).to.have.length(expectedNumber);
  }
}

describe('@integration: Delegates', () => {
  let store;
  let helper;
  let wrapper;
  let accountAPIStub;

  const voters = [{
    username: null,
    address: '3484156157234038617L',
    publicKey: 'bd56ce59f413370cf45dbc4be094acbd4de9c6894443476e5406dfc458337889',
    balance: '0',
  }, {
    username: null,
    address: '1234038617L',
    publicKey: 'bd56ce59f413370cf45dbc4be094acbd4de9c6894443476e5406dfc458337889',
    balance: '0',
  }];

  const votes = [{
    username: 'liskpool_com_01',
    address: '14593474056247442712L',
    publicKey: 'ec111c8ad482445cfe83d811a7edd1f1d2765079c99d7d958cca1354740b7614',
    vote: '4257396024977439',
    producedblocks: 43961,
    missedblocks: 283,
    rate: 2,
    rank: 2,
    approval: 35.27,
    productivity: 99.36,
  }, {
    username: 'test123',
    address: '14593474056247442712L',
    publicKey: 'ec111c8ad482445cfe83d811a7edd1f1d2765079c99d7d958cca1354740b7614',
    vote: '4257396024977439',
    producedblocks: 43961,
    missedblocks: 283,
    rate: 2,
    rank: 2,
    approval: 35.27,
    productivity: 99.36,
  }];

  beforeEach(() => {
    accountAPIStub = stub(accountAPI, 'getAccount');
  });

  afterEach(() => {
    accountAPIStub.restore();
    wrapper.update();
  });

  const setupStep = ({ accountType, id }) => {
    store = prepareStore({
      account: accountReducer,
      votes: accountReducer,
      voters: accountReducer,
      peers: peersReducer,
    }, [
      thunk,
      accountMiddleware,
      loginMiddleware,
    ]);

    const account = {
      ...accounts[accountType],
      delegate: { productivity: 10, rank: 10, approval: 30 },
      multisignatures: [],
      u_multisignatures: [],
      unconfirmedBalance: '0',
      votes,
      voters,
    };

    accountAPIStub.withArgs(match.any).returnsPromise().resolves({ ...account });
    store.dispatch(activePeerSet({ network: getNetwork(networks.mainnet.code) }));
    accountAPIStub.withArgs(match.any).returnsPromise().resolves({ ...account });
    store.dispatch(accountLoggedIn(account));

    wrapper = mount(renderWithRouter(DelegateStatistics, store,
      { match: { params: { id } } }));
    helper = new Helper(wrapper, store);
  };

  describe('Scenario: should allow to view transactions of any account', () => {
    step('Given I\'m on "accounts/123456789" as "genesis" account', () => setupStep({ accountType: 'genesis', id: '123456789' }));
    step('Then I should see the delegate statistics details renderd', () => helper.checkDetails());
  });

  describe('Scenario: should allow to filter', () => {
    step('Given I\'m on "accounts/123456789" as "genesis" account', () => setupStep({ accountType: 'genesis', id: '123456789' }));
    step('Then I should see 2 voters', () => helper.countLinks(2));
    step('When I fill  voters filter input', () => helper.fillInputField('123', 'voters'));
    step('Then I should see 2 voter', () => helper.countLinks(1));
  });
});
