import { step } from 'mocha-steps';
import { expect } from 'chai';
import { stub, match } from 'sinon';
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
import { click } from './steps';

describe('@integration: Account switch', () => {
  let store;
  let wrapper;
  let getAccountStub;
  let requestToActivePeerStub;
  let localStorageStub;

  const savedAccounts = [{
    network: networks.mainnet.code,
    publicKey: accounts.genesis.publicKey,
    balance: accounts.genesis.balance,
  }, {
    network: networks.mainnet.code,
    publicKey: accounts.delegate.publicKey,
    balance: accounts.delegate.balance,
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

    wrapper = mount(renderWithRouter(SavedAccounts, store));
    store.dispatch(accountsRetrieved());
    wrapper.update();
  };

  const clickStep = (elementName) => {
    click(wrapper, elementName);
  };

  const shouldSeeCountInstancesOf = (count, elementName) => {
    const selector = `.${elementName.replace(/ /g, '-')}`;
    expect(wrapper.find(selector)).to.have.lengthOf(count);
  };

  const shouldBeLoggedInAs = (accountName) => {
    expect(store.getState().account.publicKey).to.equal(accounts[accountName].publicKey);
  };

  describe('Scenario: should allow to remove a saved account', () => {
    step('Given I\'m on "account switcher" with accounts: "genesis,delegate,empty account"', setupStep);
    step('Then I should see 3 instances of "saved account card"', shouldSeeCountInstancesOf.bind(null, 3, 'saved account card'));
    step('When I click "edit button"', clickStep.bind(null, 'edit button'));
    step('When I click "remove button"', clickStep.bind(null, 'remove button'));
    step('When I click "remove button"', clickStep.bind(null, 'remove button'));
    step('Then I should see 2 instances of "saved account card"', shouldSeeCountInstancesOf.bind(null, 2, 'saved account card'));
  });

  describe('Scenario: should allow to switch account', () => {
    step('Given I\'m on "account switcher" with accounts: "genesis,delegate,empty account"', setupStep);
    step('When I click "saved account card"', clickStep.bind(null, 'saved account card'));
    step('Then I should be logged in as "genesis" account', shouldBeLoggedInAs.bind(null, 'genesis'));
  });
});
