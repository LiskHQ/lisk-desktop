import thunk from 'redux-thunk';
import { step } from 'mocha-steps';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, match } from 'sinon';

import * as peers from '../../src/utils/api/peers';
import * as accountAPI from '../../src/utils/api/account';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
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
    expect(this.wrapper.find('.transaction-id').first().text()).to.contain('123456789');
    expect(this.wrapper.find('#sender-address').first().text()).to.contain('123l');
  }
}

describe('@integration: Single Transaction', () => {
  let store;
  let helper;
  let wrapper;
  let requestToActivePeerStub;
  let accountAPIStub;
  let transactionAPIStub;

  beforeEach(() => {
    requestToActivePeerStub = stub(peers, 'requestToActivePeer');
    transactionAPIStub = stub(accountAPI, 'transaction');
    accountAPIStub = stub(accountAPI, 'getAccount');

    transactionAPIStub
      .returnsPromise()
      .resolves({ transaction: {
        id: '123456789', senderId: '123l', recipientId: '456l', votes: { added: [], deleted: [] },
      } });

    requestToActivePeerStub.withArgs(match.any, 'transactions/get', { id: '123456789' })
      .returnsPromise()
      .resolves({
        success: true,
        transaction: { id: '123456789', senderId: '123l', recipientId: '456l' } });
  });

  afterEach(() => {
    requestToActivePeerStub.restore();
    transactionAPIStub.restore();
    accountAPIStub.restore();
    wrapper.update();
  });

  const setupStep = ({ accountType, id }) => {
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
    wrapper = mount(renderWithRouter(SingleTransaction, store,
      { match: { params: { id } }, transaction: { id } }));
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
