import { step } from 'mocha-steps';
import { mount } from 'enzyme';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import history from '../../src/history';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import GenericStepDefinition from '../utils/genericStepDefinition';

import RegisterDelegate from '../../src/components/registerDelegate';
import { accountLoggedIn } from '../../src/actions/account';
import * as delegateApi from '../../src/utils/api/delegate';
import * as transactionsApi from '../../src/utils/api/transactions';
import accountMiddleware from '../../src/store/middlewares/account';
import peerMiddleware from '../../src/store/middlewares/peers';
import delegateReducer from '../../src/store/reducers/delegate';
import transactionsReducer from '../../src/store/reducers/transactions';
import accountReducer from '../../src/store/reducers/account';
import peersReducer from '../../src/store/reducers/peers';
import loginMiddleware from '../../src/store/middlewares/login';

import accounts from '../../test/constants/accounts';

const normalAccount = {
  ...accounts['send all account'],
};

let clock;
let store;
let helper;

describe('@integration RegisterDelegate', () => {
  let wrapper;
  let delegateApiMock;
  let transactionsApiStub;

  const setupStep = (account) => {
    store = prepareStore({
      peers: peersReducer,
      transactions: transactionsReducer,
      account: accountReducer,
      delegate: delegateReducer,
    }, [
      thunk,
      accountMiddleware,
      peerMiddleware,
      loginMiddleware,
    ]);
    wrapper = mount(renderWithRouter(RegisterDelegate, store, { history }));
    delegateApiMock = sinon.mock(delegateApi);
    store.dispatch(accountLoggedIn(account));
    helper = new GenericStepDefinition(wrapper, store);
  };


  beforeEach(() => {
    transactionsApiStub = sinon.stub(transactionsApi, 'getTransactions');
    transactionsApiStub.returnsPromise().resolves({ data: [] });
  });

  afterEach(() => {
    transactionsApiStub.restore();
  });

  describe('Scenario: allows register as a delegate for a non delegate account', () => {
    step('Given I am in "register-delegate" page', () => setupStep(normalAccount));
    step('When I click in "choose-name" button', () => helper.clickOnElement('.choose-name'));
    step('When I fill a valid name in "delegate-name" input', () => helper.fillInputField('sample_username', 'delegate-name'));
    step('Then I should be able to proceed to confirmation', () => helper.clickOnElement('.submit-delegate-name'));
    step('When I click "confirm delegate"', () => helper.fillInputField(true, 'confirm-delegate-registration'));
    step('Then I should see a confirmation step', () => helper.shouldSeeCountInstancesOf(1, 'button.registration-success'));
  });

  describe('Scenario: does not allow to register as delegate with insuficient balance', () => {
    const accountWithNoBalance = { ...normalAccount, balance: 0 };
    step('Given I am in "register-delegate" page', () => setupStep(accountWithNoBalance));
    step('Then I should not be able to click on "choose-name"', () => helper.checkDisableInput('button.choose-name'));
  });

  describe('Scenario: does not allow to register as delegate with a delegate account', () => {
    const delegateAccount = { ...normalAccount, isDelegate: true };
    step('Given I am in "register-delegate" page', () => setupStep(delegateAccount));
    step('Then I should not be able to click on "choose-name"', () => helper.checkDisableInput('button.choose-name'));
  });

  describe('Scenario: does not allow to register as delegate with a duplicate username', () => {
    step('Given I am in "register-delegate" page', () => {
      setupStep(normalAccount);
      delegateApiMock.expects('getDelegate').returnsPromise().resolves({ data: [{ username: 'peter' }] });
      clock = sinon.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
      });
    });
    step('When I click in "choose-name" button', () => helper.clickOnElement('.choose-name'));
    step('When I fill an existing delegate name in "delegate-name" input', () => {
      clock.tick(300);
      helper.fillInputField('genesis_1', 'delegate-name');
      clock.tick(300);
      helper.fillInputField('genesis_17', 'delegate-name');
    });
    step('Then I should not be able to click on "submit-delegate-name"', () => {
      helper.checkDisableInput('button.submit-delegate-name');
      clock.restore();
      delegateApiMock.restore();
    });
  });
});
