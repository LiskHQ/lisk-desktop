import { step } from 'mocha-steps';
import { stub, match, spy } from 'sinon';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';

import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import { accountsRetrieved } from '../../src/actions/savedAccounts';
import accountReducer from '../../src/store/reducers/account';
import accounts from '../constants/accounts';
import loginMiddleware from '../../src/store/middlewares/login';
import networks from '../../src/constants/networks';
import peersReducer from '../../src/store/reducers/peers';
import savedAccountsMiddleware from '../../src/store/middlewares/savedAccounts';
import savedAccountsReducer from '../../src/store/reducers/savedAccounts';
import SavedAccounts from '../../src/components/savedAccounts';
import * as accountApi from '../../src/utils/api/account';
import * as peers from '../../src/utils/api/peers';
import GenericStepDefinition from '../utils/genericStepDefinition';
import routes from '../../src/constants/routes';

describe('@integration: Account switch', () => {
  let store;
  let wrapper;
  let helper;
  let getAccountStub;
  let requestToActivePeerStub;
  let localStorageStub;

  const savedAccounts = [{
    network: networks.mainnet.code,
    publicKey: accounts.genesis.publicKey,
    balance: accounts.genesis.balance,
  }, {
    network: networks.customNode.code,
    publicKey: accounts.delegate.publicKey,
    address: 'http://localhost:8080',
    balance: accounts.delegate.balance,
    passphrase: accounts.genesis.passphrase,
  }, {
    network: networks.mainnet.code,
    publicKey: accounts['empty account'].publicKey,
    balance: accounts['empty account'].balance,
  }];

  beforeEach(() => {
    getAccountStub = stub(accountApi, 'getAccount');
    getAccountStub.withArgs(match.any, accounts.genesis.address)
      .returnsPromise().resolves(accounts.genesis);
    getAccountStub.withArgs(match.any, accounts.delegate.address)
      .returnsPromise().resolves(accounts.delegate);

    requestToActivePeerStub = stub(peers, 'requestToActivePeer');
    requestToActivePeerStub.withArgs(match.any, 'delegates/get', match.any).returnsPromise().rejects({});

    localStorageStub = stub(localStorage, 'getItem');
    localStorageStub.withArgs('accounts').returns(JSON.stringify(savedAccounts));
    localStorageStub.withArgs('lastActiveAccountIndex').returns(0);
  });

  afterEach(() => {
    getAccountStub.restore();
    requestToActivePeerStub.restore();
    localStorageStub.restore();
  });

  const setupStep = () => {
    store = prepareStore({
      savedAccounts: savedAccountsReducer,
      account: accountReducer,
      peers: peersReducer,
    }, [
      thunk,
      savedAccountsMiddleware,
      loginMiddleware,
    ]);

    const history = {
      location: {
        pathname: `${routes.main.path}${routes.dashboard.path}`,
      },
      push: spy(),
    };

    wrapper = mount(renderWithRouter(SavedAccounts, store, { history }));
    store.dispatch(accountsRetrieved());
    wrapper.update();
    helper = new GenericStepDefinition(wrapper, store);
  };

  describe('Scenario: should allow to remove a saved account with lastActiveAccount on mainnet', () => {
    step('Given I\'m on "account switcher" with accounts: "genesis,delegate,empty account"', setupStep);
    step('Then I should see 3 instances of "saved account card"', () => helper.shouldSeeCountInstancesOf(3, '.saved-account-card'));
    step('When I click "edit button"', () => helper.clickOnElement('button.edit-button'));
    step('When I click "remove button"', () => helper.clickOnElement('button.remove-button'));
    step('When I click "confirm button"', () => helper.clickOnElement('button.confirm-button'));
    step('Then I should see 2 instances of "saved account card"', () => helper.shouldSeeCountInstancesOf(2, '.saved-account-card'));
  });

  describe('Scenario: should allow to remove a saved account with lastActiveAccount on customNode', () => {
    beforeEach(() => {
      localStorageStub.withArgs('lastActiveAccountIndex').returns(1);
    });

    step('Given I\'m on "account switcher" with accounts: "genesis,delegate,empty account"', setupStep);
    step('Then I should see 3 instances of "saved account card"', () => helper.shouldSeeCountInstancesOf(3, '.saved-account-card'));
    step('When I click "edit button"', () => helper.clickOnElement('button.edit-button'));
    step('When I click "remove button"', () => helper.clickOnElement('button.remove-button'));
    step('When I click "confirm button"', () => helper.clickOnElement('button.confirm-button'));
    step('Then I should see 2 instances of "saved account card"', () => helper.shouldSeeCountInstancesOf(2, '.saved-account-card'));
  });

  describe('Scenario: should allow to "Lock ID" account', () => {
    step('Given I\'m on "account switcher" with accounts: "genesis,delegate,empty account"', setupStep);
    step('Then I should see 1 instance of "Lock ID"', () => helper.shouldSeeCountInstancesOf(1, 'strong.unlocked'));
    step('When I click "Lock ID"', () => helper.clickOnElement('strong.unlocked'));
    step('Then I should see 0 instances of "Lock ID"', () => helper.shouldSeeCountInstancesOf(0, 'strong.unlocked'));
  });

  describe('Scenario: should allow to switch account', () => {
    step('Given I\'m on "account switcher" with accounts: "genesis,delegate,empty account"', setupStep);
    step('When I click "saved account card"', () => helper.clickOnElement('.saved-account-card'));
    step('Then I should be logged in as "genesis" account', () => helper.shouldBeLoggedInAs(accounts.genesis.publicKey));
  });
});
