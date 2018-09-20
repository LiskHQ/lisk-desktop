import { step } from 'mocha-steps';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, spy } from 'sinon';
import Lisk from 'lisk-elements';

import * as accountAPI from '../../src/utils/api/account';
import * as delegateAPI from '../../src/utils/api/delegate';
import * as transactionsAPI from '../../src/utils/api/transactions';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import accountReducer from '../../src/store/reducers/account';
import transactionsReducer from '../../src/store/reducers/transactions';
import peersReducer from '../../src/store/reducers/peers';
import settingsReducer from '../../src/store/reducers/settings';
import loginMiddleware from '../../src/store/middlewares/login';
import accountMiddleware from '../../src/store/middlewares/account';
import peerMiddleware from '../../src/store/middlewares/peers';
import { activePeerSet } from '../../src/actions/peers';
import * as toasterActions from '../../src/actions/toaster';
import { settingsUpdated } from '../../src/actions/settings';
import Login from './../../src/components/login';
import accounts from '../constants/accounts';
import networks from './../../src/constants/networks';
import GenericStepDefinition from '../utils/genericStepDefinition';

const nethash = '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d';

describe('@integration: Login', () => {
  let wrapper;
  let helper;
  let accountAPIStub;
  let transactionsAPIStub;
  let delegateAPIStub;
  let errorToastDisplayedSpy;
  const localhostUrl = 'http://localhost:4218';
  const errorMessage = 'Unable to connect to the node';
  const { passphrase } = accounts.genesis;

  let APIClientBackup;
  let getConstantsMock;

  beforeEach(() => {
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

    getConstantsMock.resolves({ data: { nethash } });
  });

  afterEach(() => {
    wrapper.update();
    Lisk.APIClient = APIClientBackup;
  });

  const createStore = () => (
    prepareStore({
      account: accountReducer,
      peers: peersReducer,
      transactions: transactionsReducer,
      settings: settingsReducer,
    }, [
      thunk,
      accountMiddleware,
      loginMiddleware,
      peerMiddleware,
    ])
  );

  const restoreStubs = () => {
    accountAPIStub.restore();
    transactionsAPIStub.restore();
    delegateAPIStub.restore();
    errorToastDisplayedSpy.restore();
  };

  const stubApisDefaultScenario = () => {
    accountAPIStub = stub(accountAPI, 'getAccount');
    transactionsAPIStub = stub(transactionsAPI, 'getTransactions');
    transactionsAPIStub.returnsPromise().resolves({ data: [] });
    accountAPIStub.returnsPromise().resolves({
      address: '6307319849853921018L',
      unconfirmedBalance: '10190054753073',
      balance: '10190054753073',
      publicKey: '8ab0b8b0e663d49c8aaf3a8a6d75a46b477455f9d25ac92898461164c31758ee',
      unconfirmedSignature: 0,
      secondSignature: 0,
      secondPublicKey: null,
      multisignatures: [],
      network: networks.mainnet.code,
      u_multisignatures: [],
    });
    delegateAPIStub = stub(delegateAPI, 'getDelegate').returnsPromise().rejects();
    errorToastDisplayedSpy = spy(toasterActions, 'errorToastDisplayed');
  };

  const stubApisScenarioInvalidNode = () => {
    accountAPIStub = stub(accountAPI, 'getAccount').returnsPromise().rejects();
    delegateAPIStub = stub(delegateAPI, 'getDelegate').returnsPromise().rejects();
    errorToastDisplayedSpy = spy(toasterActions, 'errorToastDisplayed');
  };

  class Helper extends GenericStepDefinition {
    // eslint-disable-next-line class-methods-use-this
    checkIfInRoute() {
      expect(this.store.getState().account).to.have.all.keys(
        'passphrase', 'publicKey', 'address', 'peerAddress',
        'isDelegate', 'expireTime', 'u_multisignatures', 'multisignatures', 'unconfirmedBalance',
        'secondSignature', 'secondPublicKey', 'balance', 'unconfirmedSignature', 'network', 'votes', 'voters',
      );
      restoreStubs();
    }

    // eslint-disable-next-line class-methods-use-this
    checkIfErrorToastFired() {
      expect(errorToastDisplayedSpy).to.have.been.calledWith({ label: errorMessage });
      restoreStubs();
    }
  }

  const setupStep = (stubApis) => {
    const store = createStore();
    stubApis();
    store.dispatch(settingsUpdated({ showNetwork: true }));
    wrapper = mount(renderWithRouter(Login, store, { location: { search: '' } }), { activePeerSet });
    helper = new Helper(wrapper, store);
  };

  describe('Scenario: should allow to login', () => {
    step('Given I\'m on login page', () => setupStep(stubApisDefaultScenario));
    step(
      `When I fill "${passphrase}" into "passphrase" field`,
      () => helper.fillInputField(passphrase, 'passphrase'),
    );
    step('And I click "login button"', () => helper.submitForm());
    step('Then I should be logged in', () => helper.checkIfInRoute());
  });

  describe('Scenario: should show toast when trying to connect to an unavailable custom node', () => {
    step('Given I\'m on login page', () => setupStep(stubApisScenarioInvalidNode));
    step(`When I fill "${passphrase}" into "passphrase" field`, () => helper.fillInputField(passphrase, 'passphrase'));
    step('And I select option no. 3 from "network" select', () => helper.selectOptionItem(4, 'network'));
    step('And I clear "address" field', () => helper.fillInputField('', 'address'));
    step(`And I fill in "${localhostUrl}" to "address" field`, () => helper.fillInputField(localhostUrl, 'address'));
    step('And I click "login button"', () => helper.submitForm());
    step(`Then I should see text ${errorMessage} in "toast" element`, () => helper.checkIfErrorToastFired());
  });
});
