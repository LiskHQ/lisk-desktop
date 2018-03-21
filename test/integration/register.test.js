import { step } from 'mocha-steps';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, useFakeTimers, spy, match } from 'sinon';

import * as accountAPI from '../../src/utils/api/account';
import * as delegateAPI from '../../src/utils/api/delegate';
import * as netHash from '../../src/utils/api/nethash';
import Register from './../../src/components/register';
import * as peersActions from '../../src/actions/peers';
import accountReducer from '../../src/store/reducers/account';
import peersReducer from '../../src/store/reducers/peers';
import GenericStepDefinition from '../utils/genericStepDefinition';
import accountMiddleware from '../../src/store/middlewares/account';
import peerMiddleware from '../../src/store/middlewares/peers';
import loginMiddleware from '../../src/store/middlewares/login';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';

describe('@integration: Register', () => {
  let helper;
  let localStorageStub;
  let activePeerSetSpy;
  let netHashAPIStub;
  let clock;
  let passphrase;
  let accountAPIStub;
  let delegateAPIStub;

  const createStore = () =>
    prepareStore({
      account: accountReducer,
      peers: peersReducer,
    }, [
      thunk,
      accountMiddleware,
      peerMiddleware,
      loginMiddleware,
    ]);


  const restoreStubs = () => {
    localStorageStub.restore();
    activePeerSetSpy.restore();
    accountAPIStub.restore();
    delegateAPIStub.restore();
    netHashAPIStub.restore();
    clock.restore();
  };

  const stubApis = () => {
    localStorageStub = stub(localStorage, 'getItem');
    activePeerSetSpy = spy(peersActions, 'activePeerSet');
    accountAPIStub = stub(accountAPI, 'getAccount');
    accountAPIStub.returnsPromise().resolves({
      success: false,
      error: 'Account not found',
    });
    netHashAPIStub = stub(netHash, 'getNethash').returnsPromise().rejects();
    delegateAPIStub = stub(delegateAPI, 'getDelegate').returnsPromise().rejects();
    clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
  };

  class Helper extends GenericStepDefinition {
    moveMouseRandomly() {
      for (let i = 0; i < 250; i++) {
        this.wrapper.find('#generatorContainer').simulate('mousemove',
          { pageX: 200 * (i % 2), pageY: 200 * (i % 2) });
      }
    }

    rememberPassphrase() {
      passphrase = this.wrapper.find('textarea').text();
    }

    // eslint-disable-next-line class-methods-use-this
    checkIfRegistrationConfirmed() {
      expect(activePeerSetSpy).to.have.been.calledWith(match({
        passphrase,
      }));
      restoreStubs();
    }

    confirmMissingWords() {
      clock.tick(501);
      this.wrapper.update();
      const inputs = this.wrapper.find('form input');

      for (let i = 0; i < 6; i++) {
        const input = inputs.at(i);
        if (passphrase.indexOf(input.props().value) >= 0) {
          input.simulate('change', {
            target: {
              value: input.props().value,
              answer: i % 3,
            },
          });
        }
      }

      clock.tick(801);
      this.wrapper.update();
    }
  }

  const setupStep = () => {
    const store = createStore();
    stubApis();
    const wrapper = mount(renderWithRouter(Register, store, { location: { search: '' } }), { activePeerSet: peersActions.activePeerSet });
    helper = new Helper(wrapper, store);
  };

  describe('Scenario: should allow to create a new account', () => {
    step('Given I am in "register" page', setupStep);
    step('And I move mouse randomly 250 times', () => helper.moveMouseRandomly());
    step('And I click "get passphrase button"', () => helper.clickOnElement('.get-passphrase-button'));
    step('And I remember passphrase', () => helper.rememberPassphrase());
    step('And I click "yes it\'s safe button"', () => helper.clickOnElement('.yes-its-safe-button'));
    step('And confirm missing words', () => helper.confirmMissingWords());
    step('And I click "get to your dashboard button"', () => helper.clickOnElement('.get-to-your-dashboard-button'));
    step('Then I should be logged in', () => helper.checkIfRegistrationConfirmed(''));
  });
});
