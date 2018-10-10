import thunk from 'redux-thunk';
import { step } from 'mocha-steps';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, match } from 'sinon';

import * as accountAPI from '../../src/utils/api/account';
import * as transactionsAPI from '../../src/utils/api/transactions';
import { renderWithRouter, prepareStore } from '../utils/applicationInit';
import accountReducer from '../../src/store/reducers/account';
import transactionReducer from '../../src/store/reducers/transaction';
import peersReducer from '../../src/store/reducers/peers';
import votingReducer from '../../src/store/reducers/voting';
import loginMiddleware from '../../src/store/middlewares/login';
import accountMiddleware from '../../src/store/middlewares/account';
import votingMiddleware from '../../src/store/middlewares/voting';
import { activePeerSet } from '../../src/actions/peers';
import networks from './../../src/constants/networks';
import getNetwork from './../../src/utils/getNetwork';
import { accountLoggedIn } from '../../src/actions/account';
import SingleTransaction from './../../src/components/singleTransaction';
import accounts from '../constants/accounts';
import GenericStepDefinition from '../utils/genericStepDefinition';

class Helper extends GenericStepDefinition {
  checkTxDetails() {
    expect(this.wrapper).to.have.descendants('.transaction-id');
    expect(this.wrapper.find('.transaction-id').first()).to.include.text('123456789');
    expect(this.wrapper).to.have.descendants('#sender-address');
    expect(this.wrapper.find('#sender-address').first()).to.include.text('123l');
  }
}

describe('@integration: Single Transaction', () => {
  let store;
  let helper;
  let wrapper;
  let accountAPIStub;
  let getTransactionsAPIStub;
  let getSingleTransactionAPIStub;

  beforeEach(() => {
    getTransactionsAPIStub = stub(transactionsAPI, 'getTransactions');
    getSingleTransactionAPIStub = stub(transactionsAPI, 'getSingleTransaction');
    accountAPIStub = stub(accountAPI, 'getAccount');

    getTransactionsAPIStub
      .returnsPromise()
      .resolves({
        data: [{
          id: '123456789',
          senderId: '123l',
          recipientId: '456l',
          asset: {
            votes: { added: [], deleted: [] },
          },
        }],
      });

    getSingleTransactionAPIStub
      .returnsPromise()
      .resolves({
        data: [{
          id: '123456789',
          senderId: '123l',
          recipientId: '456l',
          asset: {},
        }],
      });
  });

  afterEach(() => {
    getTransactionsAPIStub.restore();
    getSingleTransactionAPIStub.restore();
    accountAPIStub.restore();
  });

  const setupStep = ({ accountType, id }) => {
    const transactionMock = {
      id,
      senderId: '123L',
    };
    store = prepareStore({
      account: accountReducer,
      transaction: transactionReducer,
      peers: peersReducer,
      voting: votingReducer,
    }, [
      thunk,
      accountMiddleware,
      loginMiddleware,
      votingMiddleware,
    ]);

    const account = {
      ...accounts[accountType],
      delegate: {},
      multisignatures: [],
      u_multisignatures: [],
      unconfirmedBalance: '0',
    };

    accountAPIStub.withArgs(match.any).returnsPromise().resolves({ ...account });
    store.dispatch(activePeerSet({ network: getNetwork(networks.mainnet.code) }));
    accountAPIStub.withArgs(match.any).returnsPromise().resolves({ ...account });
    if (accountType) { store.dispatch(accountLoggedIn(account)); }
    wrapper = mount(renderWithRouter(
      SingleTransaction, store,
      { match: { params: { id } }, transaction: transactionMock, pendingTransactions: [] },
    ));
    helper = new Helper(wrapper, store);
  };

  describe('Scenario: should allow to view transactions of any account', () => {
    step('Given I\'m on "transactions/123456789" as "genesis" account', () => setupStep({ accountType: 'genesis', id: '123456789' }));
    step('Then I should see the transaction details of 123456789', () => helper.checkTxDetails());
  });

  describe('Scenario: should allow to view transactions of any account without login', () => {
    step('Given I\'m on "transactions/123456789" as "genesis" account', () => setupStep({ id: '123456789' }));
    step('Then I should see the transaction details of 123456789', () => helper.checkTxDetails());
  });
});
