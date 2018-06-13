import { expect } from 'chai';
import { spy, mock } from 'sinon';
import middleware from './followedAccounts';
import actionTypes from '../../constants/actions';
import accounts from '../../../test/constants/accounts';
import * as followedAccountsActions from '../../actions/followedAccounts';

describe('FollowedAccounts middleware', () => {
  let store;
  let next;
  const account = {
    publicKey: accounts.genesis.publicKey,
    balance: accounts.genesis.balance,
    title: accounts.genesis.address,
  };
  const account2 = {
    publicKey: accounts.delegate.publicKey,
    balance: accounts.delegate.balance,
    title: accounts.delegate.address,
  };

  beforeEach(() => {
    spy(followedAccountsActions, 'followedAccountFetchedAndUpdated');

    store = mock();
    store.dispatch = spy();
    store.getState = () => ({
      peers: { data: {} },
      followedAccounts: { accounts: [account, account2] },
    });
    next = spy();
  });

  afterEach(() => {
    followedAccountsActions.followedAccountFetchedAndUpdated.restore();
  });

  it('should pass the action to next middleware', () => {
    const randomAction = {
      type: 'SOME_ACTION',
      data: { something: true },
    };

    middleware(store)(next)(randomAction);
    expect(next).to.have.been.calledWith(randomAction);
  });

  it(`should update the following accounts on ${actionTypes.activePeerSet} action`, () => {
    middleware(store)(next)({
      type: actionTypes.activePeerSet,
      data: {},
    });

    expect(followedAccountsActions.followedAccountFetchedAndUpdated).to.have.callCount(2);
  });

  it('should make only one request for the account information, if several transactions for the same account were made', () => {
    const transactions = {
      transactions: [{ senderId: '1234L', recipientId: accounts.genesis.address },
        { senderId: '1234L', recipientId: accounts.genesis.address }],
    };

    middleware(store)(next)({
      type: actionTypes.newBlockCreated,
      data: { block: transactions },
    });

    expect(followedAccountsActions.followedAccountFetchedAndUpdated).to.have.callCount(1);
  });

  it('should not make a request for the account information, if no relevant transaction was made', () => {
    const transactions = { transactions: [{ senderId: '1234L', recipientId: '4321L' }] };
    middleware(store)(next)({
      type: actionTypes.newBlockCreated,
      data: { block: transactions },
    });

    expect(followedAccountsActions.followedAccountFetchedAndUpdated).to.have.callCount(0);
  });
});
