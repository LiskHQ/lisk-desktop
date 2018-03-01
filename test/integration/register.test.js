import { step } from 'mocha-steps';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, useFakeTimers } from 'sinon';

import Register from './../../src/components/register';
import { activePeerSet } from '../../src/actions/peers';
import accountReducer from '../../src/store/reducers/account';
import GenericStepDefinition from '../utils/genericStepDefinition';
import accountMiddleware from '../../src/store/middlewares/account';
import peerMiddleware from '../../src/store/middlewares/peers';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';

describe('@integration: Register', () => {
  let store;
  let wrapper;
  let helper;
  let localStorageStub;
  let clock;

  afterEach(() => {
    wrapper.update();
  });

  const createStore = () => {
    store = prepareStore({
      account: accountReducer,
    }, [
      thunk,
      accountMiddleware,
      peerMiddleware,
    ]);
  };


  const restoreStubs = () => {
    localStorageStub.restore();
    clock.restore();
  };

  const stubApis = () => {
    localStorageStub = stub(localStorage, 'getItem');
    clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
  };

  class Helper extends GenericStepDefinition {
    moveMouseRandomly() {
      for (let i = 0; i < 250; i++) {
        this.wrapper.find('#generatorContainer').simulate('mousemove', { pageX: 200 * (i % 2), pageY: 200 * (i % 2) });
      }
      clock.tick(1000);
    }

    // eslint-disable-next-line class-methods-use-this
    checkIfRegistrationConfirmed() {
      expect(true).to.be.equal(true);
      restoreStubs();
    }
  }

  const setupStep = () => {
    createStore();
    stubApis();
    wrapper = mount(renderWithRouter(Register, store, { location: { search: '' } }), { activePeerSet });
    helper = new Helper(wrapper, store);
  };

  describe('Scenario: should allow to create a new account', () => {
    step('Given I am in "register" page', setupStep);
    step('And I move mouse randomly 250 times', () => helper.moveMouseRandomly());
    step('And I click "get passphrase button"', () => this.clickOnElement('.get-passphrase-button'));
    step('And I remember passphrase');
    step('And I click "next button"');
    step('And I fill in missing word');
    step('And I click "next button"');
    step('Then I should be logged in');
  });
});
