import thunk from 'redux-thunk';
import { step } from 'mocha-steps';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { stub, match, spy } from 'sinon';

import * as peers from '../../src/utils/api/peers';
import * as accountAPI from '../../src/utils/api/account';
import * as delegateAPI from '../../src/utils/api/delegate';
import * as liskServiceAPI from '../../src/utils/api/liskService';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import accountReducer from '../../src/store/reducers/account';
import transactionsReducer from '../../src/store/reducers/transactions';
import searchReducer from '../../src/store/reducers/search';
import peersReducer from '../../src/store/reducers/peers';
import loadingReducer from '../../src/store/reducers/loading';
import liskServiceReducer from '../../src/store/reducers/liskService';
import loginMiddleware from '../../src/store/middlewares/login';
import accountMiddleware from '../../src/store/middlewares/account';
import peerMiddleware from '../../src/store/middlewares/peers';
import { accountLoggedIn } from '../../src/actions/account';
import { accountsRetrieved } from '../../src/actions/savedAccounts';
import { activePeerSet } from '../../src/actions/peers';
import networks from './../../src/constants/networks';
import txTypes from './../../src/constants/transactionTypes';
import routes from '../../src/constants/routes';
import getNetwork from './../../src/utils/getNetwork';
import Dashboard from '../../src/components/dashboard';
import CurrencyGraph from '../../src/components/dashboard/currencyGraph';
import accounts from '../constants/accounts';
import GenericStepDefinition from '../utils/genericStepDefinition';
import EmptyState from '../../src/components/emptyState';

describe('@integration: Dashboard', () => {
  let store;
  let wrapper;
  let requestToActivePeerStub;
  let accountAPIStub;
  let delegateAPIStub;
  let liskServiceAPIStub;
  let helper;

  const history = { push: spy(), location: { search: '' } };
  const successMessage = 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.';

  class Helper extends GenericStepDefinition {
    clickOnTransaction() {
      this.wrapper.find('TransactionRow').at(0).simulate('click');
      expect(history.push).to.have.been.calledWith(`${routes.wallet.path}?id=10385202636`);
    }
  }

  const generateTransactions = (n) => {
    const transactionExample = {
      id: 10385202636, senderId: 'sample_address', receiverId: 'some_address', type: txTypes.send,
    };
    const transactions = new Array(n);
    transactions.fill(transactionExample);
    return transactions;
  };

  beforeEach(() => {
    requestToActivePeerStub = stub(peers, 'requestToActivePeer');
    liskServiceAPIStub = stub(liskServiceAPI, 'getCurrencyGraphData');
    accountAPIStub = stub(accountAPI, 'getAccount');
    delegateAPIStub = stub(delegateAPI, 'getDelegate');

    requestToActivePeerStub.withArgs(match.any, 'transactions', match({
      recipientId: '537318935439898807L',
      amount: 1e8,
      secret: match.any,
      secondSecret: match.any,
    }))
      .returnsPromise().resolves({ transactionId: 'Some ID' });
    requestToActivePeerStub.withArgs(match.any, 'transactions', match({ limit: 25, senderId: match.defined, recipientId: match.defined }))
      .returnsPromise().resolves({ transactions: generateTransactions(25), count: 1000 });
  });

  afterEach(() => {
    requestToActivePeerStub.restore();
    liskServiceAPIStub.restore();
    accountAPIStub.restore();
    delegateAPIStub.restore();
  });

  const setupStep = (accountType, options = { isLocked: false }) => {
    store = prepareStore({
      account: accountReducer,
      transactions: transactionsReducer,
      peers: peersReducer,
      loading: loadingReducer,
      liskService: liskServiceReducer,
      search: searchReducer,
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

    accountAPIStub.withArgs(match.any).returnsPromise().resolves({ ...account });
    store.dispatch(activePeerSet({ network: getNetwork(networks.mainnet.code) }));
    accountAPIStub.withArgs(match.any).returnsPromise()
      .resolves({
        ...account,
      });
    delegateAPIStub.withArgs(match.any).returnsPromise()
      .resolves({ delegate: { ...accounts['delegate candidate'] } });

    liskServiceAPIStub.withArgs(match.any).returnsPromise()
      .resolves({
        body: {
          candles: [{ timestamp: 111111111 }, { timestamp: 11111111112 }],
        },
      });

    store.dispatch(accountsRetrieved());
    store.dispatch(accountLoggedIn(account));

    wrapper = mount(renderWithRouter(Dashboard, store, { history }));
    helper = new Helper(wrapper, store);
  };

  describe('Send', () => {
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
      step('Given I\'m on "wallet" as "genesis" account', () => setupStep('genesis', { isLocked: true }));
      step('And I fill in "1" to "amount" field', () => { helper.fillInputField('1', 'amount'); });
      step('And I fill in "537318935439898807L" to "recipient" field', () => { helper.fillInputField('537318935439898807L', 'recipient'); });
      step('And I click "send next button"', () => helper.clickOnElement('button.send-next-button'));
      step('And I fill in passphrase of "genesis" to "passphrase" field', () => { helper.fillInputField(passphrase, 'passphrase'); });
      step('When I click "next button"', () => helper.clickOnElement('.first-passphrase-next button'));
      step('When I click "send button"', () => helper.clickOnElement('.send-button button'));
      step(`Then I should see text ${successMessage} in "result box message" element`, () => helper.haveTextOf('.result-box-message', successMessage));
    });
  });

  describe('Transactions', () => {
    describe('Scenario: should allow to view transactions', () => {
      step('Given I\'m on "wallet" as "genesis" account', () => setupStep('genesis'));
      step('Then I should see 5 rows', () => helper.shouldSeeCountInstancesOf(5, 'TransactionRow'));
      step('Then I click on one of the transactions and expect to get directed to its details', () => helper.clickOnTransaction());
    });
  });

  describe('Currency Graph', () => {
    describe('Scenario: displays the currency graph', () => {
      step('Given I\'m on "wallet" as "genesis" account', () => setupStep('genesis'));
      step('Then I should see the currency graph', () => helper.shouldSeeCountInstancesOf(1, CurrencyGraph));
      step('When I click on "step"', () => helper.clickOnElement('.step'));
      step('Then I should still see the currency graph', () => helper.shouldSeeCountInstancesOf(0, EmptyState));
    });
  });
});
