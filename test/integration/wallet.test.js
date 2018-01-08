import thunk from 'redux-thunk';
import { step } from 'mocha-steps';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, match } from 'sinon';

import * as peers from '../../src/utils/api/peers';
import * as accountApi from '../../src/utils/api/account';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import accountReducer from '../../src/store/reducers/account';
import transactionReducer from '../../src/store/reducers/transactions';
import peersReducer from '../../src/store/reducers/peers';
import loginMiddleware from '../../src/store/middlewares/login';
import accountMiddleware from '../../src/store/middlewares/account';
import { accountLoggedIn } from '../../src/actions/account';
import Wallet from '../../src/components/transactionDashboard';
import accounts from '../constants/accounts';

describe('@integration: Wallet', () => {
  let store;
  let wrapper;

  afterEach(() => {
    wrapper.update();
  });

  const setupStep = (accountType, isLocked = false) => {
    store = prepareStore({
      account: accountReducer,
      transactions: transactionReducer,
      peers: peersReducer,
    }, [
      thunk,
      accountMiddleware,
      loginMiddleware,
    ]);

    const passphrase = isLocked ? undefined : accounts[accountType].passphrase;
    const account = {
      ...accounts[accountType],
      delegate: {},
      multisignatures: [],
      u_multisignatures: [],
      unconfirmedBalance: '0',
      passphrase,
    };

    wrapper = mount(renderWithRouter(Wallet, store));
    store.dispatch(accountLoggedIn(account));
  };

  const fillInputField = (value, field) => {
    wrapper.find(`.${field} input`).simulate('change', { target: { value } });
  };

  describe('Send', () => {
    describe('Scenario: should not allow to send when not enough funds', () => {
      step('Given I\'m on "wallet" as "empty account"', setupStep.bind(null, 'empty account'));
      step('And I fill in "1" to "amount" field', fillInputField.bind(null, '1', 'amount'));
      step('And I fill in "537318935439898807L" to "recipient" field', fillInputField.bind(null, '537318935439898807L', 'recipient'));
      step('Then I should see "Insufficient funds" error message', () => {
        expect(wrapper.find('Input').at(1).html()).to.contain('Insufficient funds');
      });
      step('And "send next button" should be disabled', () => {
        expect(wrapper.find('.send-next-button button').filterWhere(item => item.prop('disabled') === true)).to.have.lengthOf(1);
      });
    });

    describe('Scenario: should give and error message when sending fails', () => {
      step('Given I\'m on "wallet" as "genesis" account', setupStep.bind(null, 'genesis'));
      step('And I fill in "1" to "amount" field', fillInputField.bind(null, '1', 'amount'));
      step('And I fill in "537318935439898807L" to "recipient" field', fillInputField.bind(null, '537318935439898807L', 'recipient'));
      step('And I click "send next button"', () => {
        wrapper.find('.send-next-button button').simulate('click');
      });
      step('When I click "send button"', () => {
        const sendMock = stub(accountApi, 'send');
        sendMock.returnsPromise().rejects({});
        wrapper.find('form').simulate('submit');
        sendMock.restore();
      });
      step('Then I should see text "An error occurred while creating the transaction." in "result box message" element', () => {
        expect(wrapper.find('.result-box-message').text()).to.contain('An error occurred while creating the transaction.');
      });
    });

    describe('Scenario: should allow to send LSK from unlocked account', () => {
      const message = 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.';
      step('Given I\'m on "wallet" as "genesis" account', setupStep.bind(null, 'genesis'));
      step('And I fill in "1" to "amount" field', fillInputField.bind(null, '1', 'amount'));
      step('And I fill in "537318935439898807L" to "recipient" field', fillInputField.bind(null, '537318935439898807L', 'recipient'));
      step('And I click "send next button"', () => {
        wrapper.find('.send-next-button button').simulate('click');
      });
      step('When I click "send button"', () => {
        const sendMock = stub(accountApi, 'send');
        sendMock.returnsPromise().resolves({ transactionId: '537318935439898807L' });
        wrapper.find('form').simulate('submit');
        sendMock.restore();
      });
      step(`Then I should see text "${message}"`, () => {
        expect(wrapper.find('.result-box-message').text()).to.contain(message);
      });
    });

    describe('Scenario: should allow to send LSK from locked account', () => {
      const { passphrase } = accounts.genesis;
      const message = 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.';
      step('Given I\'m on "wallet" as "genesis" account', setupStep.bind(null, 'genesis', true));
      step('And I fill in "1" to "amount" field', fillInputField.bind(null, '1', 'amount'));
      step('And I fill in "537318935439898807L" to "recipient" field', fillInputField.bind(null, '537318935439898807L', 'recipient'));
      step('And I click "send next button"', () => {
        wrapper.find('.send-next-button button').simulate('click');
      });
      step('And I fill in passphrase of "genesis" to "passphrase" field', fillInputField.bind(null, passphrase, 'passphrase'));
      step('When I click "send button"', () => {
        const sendMock = stub(accountApi, 'send');
        sendMock.returnsPromise().resolves({ transactionId: '537318935439898807L' });
        wrapper.find('form').simulate('submit');
        sendMock.restore();
      });
      step(`Then I should see text "${message}"`, () => {
        expect(wrapper.find('.result-box-message').text()).to.contain(message);
      });
    });

    describe('Scenario: should allow to send LSK from unlocked account with 2nd passphrase', () => {
      const { secondPassphrase } = accounts['second passphrase account'];
      const message = 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.';

      step('Given I\'m on "wallet" as "second passphrase account"', setupStep.bind(null, 'second passphrase account'));
      step('And I fill in "1" to "amount" field', fillInputField.bind(null, '1', 'amount'));
      step('And I fill in "537318935439898807L" to "recipient" field', fillInputField.bind(null, '537318935439898807L', 'recipient'));
      step('And I click "send next button"', () => {
        wrapper.find('.send-next-button button').simulate('click');
      });
      step('And I fill in second passphrase of "second passphrase account" to "second passphrase" field', fillInputField.bind(null, secondPassphrase, 'second-passphrase'));
      step('When I click "send button"', () => {
        const sendMock = stub(accountApi, 'send');
        sendMock.returnsPromise().resolves({ transactionId: '537318935439898807L' });
        wrapper.find('form').simulate('submit');
        sendMock.restore();
      });
      step(`Then I should see text "${message}"`, () => {
        expect(wrapper.find('.result-box-message').text()).to.contain(message);
      });
    });

    describe('Scenario: should allow to send LSK from locked account with 2nd passphrase', () => {
      const { secondPassphrase, passphrase } = accounts['second passphrase account'];
      const message = 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.';

      step('Given I\'m on "wallet" as "second passphrase account"', setupStep.bind(null, 'second passphrase account', true));
      step('And I fill in "1" to "amount" field', fillInputField.bind(null, '1', 'amount'));
      step('And I fill in "537318935439898807L" to "recipient" field', fillInputField.bind(null, '537318935439898807L', 'recipient'));
      step('And I click "send next button"', () => {
        wrapper.find('.send-next-button button').simulate('click');
      });
      step('And I fill in passphrase of "second passphrase account" to "passphrase" field', fillInputField.bind(null, passphrase, 'passphrase'));
      step('And I fill in second passphrase of "second passphrase account" to "second passphrase" field', fillInputField.bind(null, secondPassphrase, 'second-passphrase'));
      step('When I click "send button"', () => {
        const sendMock = stub(accountApi, 'send');
        sendMock.returnsPromise().resolves({ transactionId: '537318935439898807L' });
        wrapper.find('form').simulate('submit');
        sendMock.restore();
      });
      step(`Then I should see text "${message}"`, () => {
        expect(wrapper.find('.result-box-message').text()).to.contain(message);
      });
    });
  });

  describe('transactions', () => {
    let requestToActivePeerStub;

    beforeEach(() => {
      requestToActivePeerStub = stub(peers, 'requestToActivePeer');

      let transactions = new Array(25);
      transactions.fill({ senderId: 'sample_address', receiverId: 'some_address' });
      transactions.count = 25;
      requestToActivePeerStub.withArgs(match.any, match.any, match({ limit: 25 }))
        .returnsPromise().resolves({ transactions });

      transactions = new Array(45);
      transactions.fill({ senderId: 'sample_address', receiverId: 'some_address' });
      transactions.count = 45;
      requestToActivePeerStub.withArgs(match.any, match.any, match({ limit: 20 }))
        .returnsPromise().resolves({ transactions });
    });

    afterEach(() => {
      requestToActivePeerStub.restore();
    });

    describe.only('Scenario: should allow to view transactions', () => {
      step('Given I\'m on "wallet" as "genesis" account', setupStep.bind(null, 'genesis'));
      step('Then I should see 25 rows', () => {
        expect(wrapper.find('TransactionRow')).to.have.length(25);
      });
      step('When I scroll to the bottom of "transactions box"', () => {
        wrapper.find('Waypoint').props().onEnter();
      });
      step('Then I should see 45 rows', () => {
        expect(wrapper.find('TransactionRow')).to.have.length(45);
      });
    });

    describe('Scenario: should allow to filter transactions', () => {
      // functionality not implemented yet
    });

    describe('Scenario: should allow to search transactions', () => {
      // functionality not implemented yet
    });
  });
});
