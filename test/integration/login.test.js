import { step } from 'mocha-steps';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, spy } from 'sinon';

import * as peers from '../../src/utils/api/peers';
import * as accountAPI from '../../src/utils/api/account';
import * as delegateAPI from '../../src/utils/api/delegate';
import * as netHash from '../../src/utils/api/nethash';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import accountReducer from '../../src/store/reducers/account';
import peersReducer from '../../src/store/reducers/peers';
import settingsReducer from '../../src/store/reducers/settings';
import savedAccountsReducer from '../../src/store/reducers/savedAccounts';
import loginMiddleware from '../../src/store/middlewares/login';
import accountMiddleware from '../../src/store/middlewares/account';
import peerMiddleware from '../../src/store/middlewares/peers';
import { activePeerSet } from '../../src/actions/peers';
import * as toasterActions from '../../src/actions/toaster';
import Login from './../../src/components/login';
import accounts from '../constants/accounts';
import { fillInputField, selectOptionItem } from './steps';

describe('@integration: Login', () => {
  let store;
  let wrapper;
  const requestToActivePeerStub = stub(peers, 'requestToActivePeer');
  const accountAPIStub = stub(accountAPI, 'getAccount');
  const delegateAPIStub = stub(delegateAPI, 'getDelegate');
  const netHashAPIStub = stub(netHash, 'getNethash');
  const localStorageStub = stub(localStorage, 'getItem');
  const errorToastDisplayedSpy = spy(toasterActions, 'errorToastDisplayed');
  const localhostUrl = 'http://localhost:4218';
  const connectionErrorMessage = 'Unable to connect to the node';

  afterEach(() => {
    wrapper.update();
  });

  const createStore = () => {
    store = prepareStore({
      account: accountReducer,
      peers: peersReducer,
      savedAccounts: savedAccountsReducer,
      settings: settingsReducer,
    }, [
      thunk,
      accountMiddleware,
      loginMiddleware,
      peerMiddleware,
    ]);
  };

  const setupScenarioDefault = () => {
    createStore();

    localStorageStub.withArgs('accounts').returns(JSON.stringify([{}, {}]));
    localStorageStub.withArgs('showNetwork').returns(JSON.stringify(true));
    accountAPIStub.returnsPromise().resolves({
      address: '6307319849853921018L',
      unconfirmedBalance: '10190054753073',
      balance: '10190054753073',
      publicKey: '8ab0b8b0e663d49c8aaf3a8a6d75a46b477455f9d25ac92898461164c31758ee',
      unconfirmedSignature: 0,
      secondSignature: 0,
      secondPublicKey: null,
      multisignatures: [],
      u_multisignatures: [],
    });
    delegateAPIStub.returnsPromise().rejects();

    wrapper = mount(renderWithRouter(Login, store, { location: { search: '' } }));
  };

  const setupScenarioInvalidNode = () => {
    createStore();

    localStorageStub.withArgs('accounts').returns(JSON.stringify([{}, {}]));
    localStorageStub.withArgs('showNetwork').returns(JSON.stringify(true));
    netHashAPIStub.returnsPromise().rejects();
    accountAPIStub.returnsPromise().rejects();
    delegateAPIStub.returnsPromise().rejects();

    wrapper = mount(renderWithRouter(Login, store, { location: { search: '' } }), { activePeerSet });
  };

  const restoreStubs = () => {
    requestToActivePeerStub.restore();
    localStorageStub.restore();
    accountAPIStub.restore();
    delegateAPIStub.restore();
  };

  const submit = () => {
    wrapper.find('form').simulate('submit', {});
  };

  const checkIfInRoute = () => {
    expect(store.getState().account).to.have.all.keys('passphrase', 'publicKey', 'address', 'delegate',
      'isDelegate', 'expireTime', 'u_multisignatures', 'multisignatures', 'unconfirmedBalance',
      'secondSignature', 'secondPublicKey', 'balance', 'unconfirmedSignature');
    restoreStubs();
  };

  const checkIfErrorToastFired = () => {
    expect(errorToastDisplayedSpy).to.have.been.calledWith({ label: connectionErrorMessage });
    restoreStubs();
  };

  describe('Scenario: should allow to login', () => {
    step('Given I\'m on login page', setupScenarioDefault);
    step(`When I fill "${accounts.genesis.passphrase}" into "passphrase" field`,
      () => fillInputField(wrapper, accounts.genesis.passphrase, 'passphrase'));
    step('And I click "login button"', () => submit(wrapper, 'login button'));
    step('Then I should be logged in', () => checkIfInRoute());
  });

  describe('Scenario: should show toast when trying to connect to an unavailable custom node', () => {
    step('Given I\'m on login page', setupScenarioInvalidNode);
    step(`When I fill "${accounts.genesis.passphrase}" into "passphrase" field`, () =>
      fillInputField(wrapper, accounts.genesis.passphrase, 'passphrase'));
    step('And I select option no. 3 from "network" select', () => selectOptionItem(wrapper, 3, 'network'));
    step('And I clear "address" field', () => fillInputField(wrapper, '', 'address'));
    step(`And I fill in "${localhostUrl}" to "address" field`, () => fillInputField(wrapper, localhostUrl, 'address'));
    step('And I click "login button"', () => submit(wrapper, 'login button'));
    step(`Then I should see text ${connectionErrorMessage} in "toast" element`, () => checkIfErrorToastFired());
  });
});
