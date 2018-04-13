import { step } from 'mocha-steps';
import { mount } from 'enzyme';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import GenericStepDefinition from '../utils/genericStepDefinition';

import RegisterDelegate from '../../src/components/registerDelegate';
import { accountLoggedIn } from '../../src/actions/account';
import * as delegateApi from '../../src/utils/api/delegate';
import accountMiddleware from '../../src/store/middlewares/account';
import peerMiddleware from '../../src/store/middlewares/peers';
import delegateReducer from '../../src/store/reducers/delegate';
import accountReducer from '../../src/store/reducers/account';
import peersReducer from '../../src/store/reducers/peers';
import loginMiddleware from '../../src/store/middlewares/login';

const normalAccount = {
  passphrase: 'pass',
  isDelegate: false,
  address: '16313739661670634666L',
  balance: 1000e8,
};

let clock;
let store;
let helper;

/* eslint-disable mocha/no-exclusive-tests */
describe.only('@integration RegisterDelegate', () => {
  let wrapper;
  let delegateApiMock;

  const setupStep = () => {
    store = prepareStore({
      peers: peersReducer,
      account: accountReducer,
      delegate: delegateReducer,
    }, [
      thunk,
      accountMiddleware,
      peerMiddleware,
      loginMiddleware,
    ]);
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
    wrapper = mount(renderWithRouter(RegisterDelegate, store, { history }));
    delegateApiMock = sinon.mock(delegateApi);
    store.dispatch(accountLoggedIn(normalAccount));
    helper = new GenericStepDefinition(wrapper, store);
  };

  beforeEach(() => {
  });

  afterEach(() => {
    clock.restore();
    delegateApiMock.restore();
  });

  describe('Scenario: allows register as a delegate for a non delegate account', () => {
    step('Given I am in "register-delegate" page', setupStep);
    step('When I click in "choose-name" button', () => helper.clickOnElement('.choose-name'));
    step('When I fill a valid name in "delegate-name" input', () => helper.fillInputField('sample_username', 'delegate-name'));
    step('Then I should be able to proceed to confirmation', () => helper.clickOnElement('.submit-delegate-name'));
    step('When I click "confirm delegate"', () => helper.fillInputField(true, 'confirm-delegate-registration'));
    step('Then I should see a confirmation step', () => helper.shouldSeeCountInstancesOf(1, 'button.registration-success'));
  });
});
/* eslint-enable mocha/no-exclusive-tests */
