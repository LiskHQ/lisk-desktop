import thunk from 'redux-thunk';
import { step } from 'mocha-steps';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, match, spy } from 'sinon';

import * as accountAPI from '../../src/utils/api/account';
import * as transactionsAPI from '../../src/utils/api/transactions';
import * as delegateAPI from '../../src/utils/api/delegate';
import * as liskServiceApi from '../../src/utils/api/liskService';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import followedAccountsReducer from '../../src/store/reducers/followedAccounts';
import accountReducer from '../../src/store/reducers/account';
import transactionReducer from '../../src/store/reducers/transaction';
import transactionsReducer from '../../src/store/reducers/transactions';
import settingsReducer from '../../src/store/reducers/settings';
import peersReducer from '../../src/store/reducers/peers';
import loadingReducer from '../../src/store/reducers/loading';
import searchReducer from '../../src/store/reducers/search';
import filtersReducer from '../../src/store/reducers/filters';
import loginMiddleware from '../../src/store/middlewares/login';
import accountMiddleware from '../../src/store/middlewares/account';
import peerMiddleware from '../../src/store/middlewares/peers';
import { accountLoggedIn } from '../../src/actions/account';
import { activePeerSet } from '../../src/actions/peers';
import networks from './../../src/constants/networks';
import txTypes from './../../src/constants/transactionTypes';
import getNetwork from './../../src/utils/getNetwork';
import Wallet from '../../src/components/transactionDashboard';
import accounts from '../constants/accounts';
import GenericStepDefinition from '../utils/genericStepDefinition';
import txFilters from './../../src/constants/transactionFilters';
import routes from './../../src/constants/routes';

let walletTransactionsProps;

class Helper extends GenericStepDefinition {
  checkSelectedFilter(filter) {
    const expectedClass = '_active';

    const activeFilter = this.wrapper.find('.transaction-filter-item').filterWhere((item) => {
      const className = item.prop('className');
      return className.includes(expectedClass);
    });

    expect(activeFilter.text().toLowerCase()).to.equal(filter);
  }

  checkConfirmRequest(account) {
    const address = accounts[account].address;
    this.haveLengthOf('.confirm-request-step', 1);
    this.haveTextOf('.copy-title', `lisk://wallet?recipient=${address}&amount=1`);
    expect(this.wrapper.find('QRCode')
      .filterWhere(item => item.prop('value') === `lisk://wallet?recipient=${address}&amount=1`))
      .to.have.lengthOf(1);
  }

  // eslint-disable-next-line class-methods-use-this
  checkRedirectionToDetails(transactionId) {
    expect(walletTransactionsProps.history.push).to.have.been.calledWith(`${routes.wallet.path}?id=${transactionId}`);
  }
}

describe('@integration: Wallet', () => {
  let store;
  let wrapper;
  let accountAPIStub;
  let delegateAPIStub;
  let localStorageStub;
  let getTransactionsStub;
  let sendTransactionsStub;
  let liskServiceStub;
  let helper;

  const successMessage = 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.';
  const errorMessage = 'An error occurred while creating the transaction.';

  const generateTransactions = (n) => {
    const transactionExample = {
      senderId: 'sample_address', receiverId: 'some_address', type: txTypes.send, id: '123456',
    };
    const transactions = new Array(n);
    transactions.fill(transactionExample);
    return transactions;
  };

  const setupStep = (accountType, options = { isLocked: false, withPublicKey: true }) => {
    store = prepareStore({
      followedAccounts: followedAccountsReducer,
      account: accountReducer,
      transaction: transactionReducer,
      transactions: transactionsReducer,
      peers: peersReducer,
      loading: loadingReducer,
      search: searchReducer,
      settings: settingsReducer,
      filters: filtersReducer,
    }, [
      thunk,
      accountMiddleware,
      loginMiddleware,
      peerMiddleware,
    ]);

    const passphrase = options.isLocked ? undefined : accounts[accountType].passphrase;
    const account = {
      ...accounts[accountType],
      delegate: {},
      multisignatures: [],
      u_multisignatures: [],
      unconfirmedBalance: '0',
      passphrase,
    };

    if (!options.withPublicKey) {
      delete account.serverPublicKey;
    }

    accountAPIStub.withArgs(match.any).returnsPromise().resolves({ data: [...account] });
    store.dispatch(activePeerSet({ network: getNetwork(networks.mainnet.code) }));
    delegateAPIStub.withArgs(match.any).returnsPromise()
      .resolves({ data: [{ ...accounts['delegate candidate'] }] });

    store.dispatch(accountLoggedIn(account));

    const history = {
      location: {
        search: '',
        pathname: '',
      },
      push: spy(),
    };

    wrapper = mount(renderWithRouter(Wallet, store, { history }));

    walletTransactionsProps = wrapper.find('WalletTransactions').props();
    walletTransactionsProps.history.push = spy();

    helper = new Helper(wrapper, store);
  };

  beforeEach(() => {
    accountAPIStub = stub(accountAPI, 'getAccount');
    delegateAPIStub = stub(delegateAPI, 'getDelegate');
    localStorageStub = stub(localStorage, 'getItem');
    liskServiceStub = stub(liskServiceApi, 'getPriceTicker');
    liskServiceStub.withArgs(match.any).returnsPromise().resolves({ tickers: {} });
  });

  afterEach(() => {
    accountAPIStub.restore();
    delegateAPIStub.restore();
    localStorageStub.restore();
    liskServiceStub.restore();
  });

  describe('Send', () => {
    beforeEach(() => {
      getTransactionsStub = stub(transactionsAPI, 'getTransactions');
      sendTransactionsStub = stub(transactionsAPI, 'send');

      // transactionsFilterSet do pass filter
      getTransactionsStub.withArgs({
        activePeer: match.defined,
        address: match.defined,
        limit: 25,
        filter: txFilters.all,
      }).returnsPromise().resolves({ data: generateTransactions(25), meta: { count: 1000 } });

      // loadTransactions does not pass filter
      getTransactionsStub.withArgs({
        activePeer: match.defined,
        address: match.defined,
        limit: 25,
      }).returnsPromise().resolves({ data: generateTransactions(25), meta: { count: 1000 } });

      // second passphrase send request
      sendTransactionsStub.withArgs(
        match.defined,
        match.defined,
        match.defined,
        match.defined,
        match.defined,
        '',
      ).returnsPromise().resolves({ data: [] });

      // rest of accounts send request
      sendTransactionsStub.withArgs(
        match.defined,
        match.defined,
        match.defined,
        match.defined,
        null,
        '',
      ).returnsPromise().resolves({ data: [] });


      // account initialisation send request (no reference field)
      sendTransactionsStub.withArgs(
        match.defined,
        match.defined,
        match.defined,
        match.defined,
        null,
        undefined,
      ).returnsPromise().resolves({ data: [] });
    });

    afterEach(() => {
      getTransactionsStub.restore();
      sendTransactionsStub.restore();
    });

    describe('Scenario: should not allow to send when not enough funds', () => {
      step('Given I\'m on "wallet" as "empty account"', () => setupStep('empty account'));
      step('And I fill in "1" to "amount" field', () => helper.fillInputField('1', 'amount'));
      step('And I fill in "537318935439898807L" to "recipient" field', () => helper.fillInputField('537318935439898807L', 'recipient'));
      step('Then I should see "Not enough LSK" error message', () => {
        expect(wrapper.find('Input').at(2).html()).to.contain('Not enough LSK');
      });
      step('And "send next button" should be disabled', () => {
        expect(wrapper.find('.send-next-button button').filterWhere(item => item.prop('disabled') === true)).to.have.lengthOf(1);
      });
    });

    describe('Scenario: should give and error message when sending fails', () => {
      step('Given I\'m on "wallet" as "genesis" account', () => setupStep('genesis'));
      step('And I fill in "1" to "amount" field', () => helper.fillInputField('1', 'amount'));
      step('And I fill in "537318935439898807L" to "recipient" field', () => helper.fillInputField('537318935439898807L', 'recipient'));
      step('And I click "send next button"', () => helper.clickOnElement('button.send-next-button'));
      step('When I click "send button"', () => {
        sendTransactionsStub.withArgs(match.any, '537318935439898807L', match.any, accounts.genesis.passphrase, match.any, match.any).returnsPromise().rejects({});
        helper.clickOnElement('.send-button button');
      });
      step(`Then I should see text ${errorMessage} in "result box message" element`, () => helper.haveTextOf('.result-box-message', errorMessage));
    });

    describe('Scenario: should allow to send LSK from unlocked account', () => {
      step('Given I\'m on "wallet" as "genesis" account', () => setupStep('genesis'));
      step('And I fill in "1" to "amount" field', () => { helper.fillInputField('1', 'amount'); });
      step('And I fill in "537318935439898807L" to "recipient" field', () => { helper.fillInputField('537318935439898807L', 'recipient'); });
      step('And I click "send next button"', () => { helper.clickOnElement('button.send-next-button'); });
      step('When I click "send button"', () => helper.clickOnElement('button.send-button button'));
      step(`Then I should see text ${successMessage} in "result box message" element`, () => helper.haveTextOf('.result-box-message', successMessage));
    });

    describe('Scenario: should allow to send LSK from locked account', () => {
      const { passphrase } = accounts.genesis;
      step('Given I\'m on "wallet" as "genesis" account', () => setupStep('genesis', { isLocked: true, withPublicKey: true }));
      step('And I fill in "1" to "amount" field', () => { helper.fillInputField('1', 'amount'); });
      step('And I fill in "537318935439898807L" to "recipient" field', () => { helper.fillInputField('537318935439898807L', 'recipient'); });
      step('And I click "send next button"', () => helper.clickOnElement('button.send-next-button'));
      step('And I fill in passphrase of "genesis" to "passphrase" field', () => { helper.fillInputField(passphrase, 'passphrase'); });
      step('When I click "next button"', () => helper.clickOnElement('.first-passphrase-next button'));
      step('When I click "send button"', () => helper.clickOnElement('.send-button button'));
      step(`Then I should see text ${successMessage} in "result box message" element`, () => helper.haveTextOf('.result-box-message', successMessage));
    });

    describe('Scenario: should allow to send LSK from unlocked account with 2nd passphrase', () => {
      const { secondPassphrase } = accounts['second passphrase account'];
      step('Given I\'m on "wallet" as "second passphrase account"', () => setupStep('second passphrase account'));
      step('And I fill in "1" to "amount" field', () => { helper.fillInputField('1', 'amount'); });
      step('And I fill in "537318935439898807L" to "recipient" field', () => { helper.fillInputField('537318935439898807L', 'recipient'); });
      step('And I click "send next button"', () => helper.clickOnElement('button.send-next-button'));
      step('And I fill in second passphrase of "second passphrase account" to "second passphrase" field', () => { helper.fillInputField(secondPassphrase, 'second-passphrase'); });
      step('When I click "next button"', () => helper.clickOnElement('.second-passphrase-next button'));
      step('When I click "send button"', () => helper.clickOnElement('.send-button button'));
      step(`Then I should see text ${successMessage} in "result box message" element`, () => helper.haveTextOf('.result-box-message', successMessage));
    });

    describe('Scenario: should allow to send LSK from locked account with 2nd passphrase', () => {
      const { secondPassphrase, passphrase } = accounts['second passphrase account'];
      step('Given I\'m on "wallet" as "second passphrase account"', () => setupStep('second passphrase account', { isLocked: true, withPublicKey: true }));
      step('And I fill in "1" to "amount" field', () => { helper.fillInputField('1', 'amount'); });
      step('And I fill in "537318935439898807L" to "recipient" field', () => { helper.fillInputField('537318935439898807L', 'recipient'); });
      step('And I click "send next button"', () => helper.clickOnElement('button.send-next-button'));
      step('And I fill in passphrase of "second passphrase account" to "passphrase" field', () => { helper.fillInputField(passphrase, 'passphrase'); });
      step('When I click "next button"', () => helper.clickOnElement('.first-passphrase-next button'));
      step('And I fill in second passphrase of "second passphrase account" to "second passphrase" field', () => { helper.fillInputField(secondPassphrase, 'second-passphrase'); });
      step('When I click "next button"', () => helper.clickOnElement('.second-passphrase-next button'));
      step('When I click "send button"', () => helper.clickOnElement('.send-button button'));
      step(`Then I should see text ${successMessage} in "result box message" element`, () => helper.haveTextOf('.result-box-message', successMessage));
    });

    describe('Scenario: should show account initialisation option if no public key and balance is greater than 0', () => {
      step('Given I\'m on "wallet" as "genesis" account and need initialization', () => setupStep('genesis', { isLocked: false, withPublicKey: false }));
      step('Then I should see the account init option', () => helper.haveTextOf('header h2', 'Initialize Lisk ID'));
      step('When I click "account init button"', () => helper.clickOnElement('.account-init-button button'));
      step('Then I should be on the confirm page', () => helper.haveTextOf('header h2', 'Initialize Lisk ID'));
      step('When I click "send button"', () => helper.clickOnElement('button.send-button button'));
      step(`Then I should see text ${successMessage} in "result box message" element`, () => helper.haveTextOf('.result-box-message', successMessage));
    });

    describe('Scenario: should display the request LSK component when clicking on the tab', () => {
      step('Given I\'m on "wallet" as "genesis" account', () => setupStep('genesis'));
      step('When I click "request tab"', () => { helper.clickOnElement('.request-tab'); });
      step('Then I should see the QR code', () => helper.haveLengthOf('.request-qr-code', 1));
      step('When I click "send tab"', () => { helper.clickOnElement('.send-tab'); });
      step('Then I should not see the QR code anymore', () => helper.haveLengthOf('.request-qr-code', 0));
    });

    describe('Scenario: should request specific amount', () => {
      step('Given I\'m on "wallet" as "genesis" account', () => setupStep('genesis'));
      step('When I click "request tab"', () => { helper.clickOnElement('.request-tab'); });
      step('Then I should see the QR code', () => helper.haveLengthOf('.request-qr-code', 1));
      step('When I click "specify request"', () => { helper.clickOnElement('.specify-request'); });
      step('And I fill in "1" to "amount" field', () => { helper.fillInputField('1', 'amount'); });
      step('When I click "confirm request"', () => { helper.clickOnElement('.confirm-request'); });
      step('Then I should be on the confirm page with correct links and QR code', () => helper.checkConfirmRequest('genesis'));
    });

    describe('Scenario: should not show account initialisation option if public key and balance is greater than 0', () => {
      step('Given I\'m on "wallet" as "genesis" account and already initialized ', () => setupStep('genesis'));
      step('Then I should not see the account init option', () => helper.haveTextOf('header h2', 'Transfer'));
    });

    describe('Scenario: should not show account initialisation option if no public key and balance equals 0', () => {
      step('Given I\'m on "wallet" as "genesis" account without need for initialized', () => setupStep('empty account', { isLocked: false, withPublicKey: false }));
      step('Then I should not see the account init option', () => helper.haveTextOf('header h2', 'Transfer'));
    });

    describe('Scenario: should close account initialisation option when discarded', () => {
      step('Given I\'m on "wallet" as "genesis" account and need initialization', () => setupStep('genesis', { isLocked: false, withPublicKey: false }));
      step('When I click "account init discard button"', () => helper.clickOnElement('.account-init-discard-button'));
      step('Then I should see the empty send form', () => {
        helper.haveInputValueOf('.recipient input', '');
        helper.haveInputValueOf('.amount input', '');
      });
    });
  });

  describe('Transactions', () => {
    beforeEach(() => {
      getTransactionsStub = stub(transactionsAPI, 'getTransactions');

      // transactionsFilterSet do pass filter
      getTransactionsStub.withArgs({
        activePeer: match.defined,
        address: match.defined,
        limit: 25,
        filter: txFilters.all,
      }).returnsPromise().resolves({ data: generateTransactions(25), meta: { count: 50 } });

      // loadTransactions does not pass filter
      getTransactionsStub.withArgs({
        activePeer: match.defined,
        address: match.defined,
        limit: 25,
      }).returnsPromise().resolves({ data: generateTransactions(25), meta: { count: 50 } });

      // transactionsRequested does pass filter, offset
      getTransactionsStub.withArgs({
        activePeer: match.defined,
        address: match.defined,
        limit: 25,
        offset: match.defined,
        filter: txFilters.all,
      }).returnsPromise().resolves({ data: generateTransactions(25), meta: { count: 50 } });


      // // NOTE: transactionsFilterSet does not use offset
      getTransactionsStub.withArgs({
        activePeer: match.defined,
        address: match.defined,
        limit: 25,
        filter: txFilters.outgoing,
      }).returnsPromise().resolves({ data: generateTransactions(25), meta: { count: 25 } });

      getTransactionsStub.withArgs({
        activePeer: match.defined,
        address: match.defined,
        limit: 25,
        filter: txFilters.incoming,
      }).returnsPromise().resolves({ data: generateTransactions(25), meta: { count: 25 } });
    });

    afterEach(() => {
      getTransactionsStub.restore();
    });

    describe('Scenario: should allow to view transactions', () => {
      step('Given I\'m on "wallet" as "genesis" account', () => setupStep('genesis'));
      step('Then I should see 25 rows', () => helper.shouldSeeCountInstancesOf(25, 'TransactionRow'));
      step('When I scroll to the bottom of "transactions box"', () => { wrapper.find('Waypoint').props().onEnter(); });
      step('Then I should see 50 rows', () => { wrapper.update(); helper.shouldSeeCountInstancesOf(50, 'TransactionRow'); });
      step('When I click on a transaction row', () => helper.clickOnElement('.transactions-row'));
      step('Then I should be redirected to transactoinDetails step', () => helper.checkRedirectionToDetails('123456'));
    });

    describe('Scenario: should allow to filter transactions', () => {
      step('Given I\'m on "wallet" as "genesis" account', () => setupStep('genesis'));
      step('Then the "All" filter should be selected by default', () => helper.checkSelectedFilter('all'));
      step('When I click on the "Outgoing" filter', () => helper.clickOnElement('.filter-out'));
      step('Then I expect to see the results for "Outgoing"', () => helper.shouldSeeCountInstancesOf(25, 'TransactionRow'));
      step('When I click on the "Incoming" filter', () => helper.clickOnElement('.filter-in'));
      step('Then I expect to see the results for "Incoming"', () => helper.shouldSeeCountInstancesOf(25, 'TransactionRow'));
      step('When I click again on the "All" filter', () => helper.clickOnElement('.filter-all'));
      step('Then I expect to see the results for "All"', () => helper.shouldSeeCountInstancesOf(25, 'TransactionRow'));
    });
  });
});
