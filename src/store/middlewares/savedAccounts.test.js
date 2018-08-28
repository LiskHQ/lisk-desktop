import { expect } from 'chai';
import { spy, mock, match } from 'sinon';

import * as accountApi from '../../utils/api/account';
import { accountLoading, accountLoggedOut } from '../../actions/account';
import { accountSaved } from '../../actions/savedAccounts';
import * as peersActions from '../../actions/peers';
import actionTypes from '../../constants/actions';
import middleware from './savedAccounts';
import networks from '../../constants/networks';

describe('SavedAccounts middleware', () => {
  let store;
  let next;
  let state;
  let getAccountStub;
  const address = networks.testnet.nodes[0];
  const passphrase = 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit';
  const publicKey = 'fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88';
  const publicKey2 = 'aab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88';
  const balance = 10e8;

  beforeEach(() => {
    store = mock();
    store.dispatch = spy();
    state = {
      peers: {
        data: {
          currentNode: networks.mainnet.nodes[0],
          options: { code: networks.mainnet.code },
        },
        options: {
          code: networks.mainnet.code,
        },
      },
      savedAccounts: {
        accounts: [
          {
            publicKey,
            network: networks.mainnet.code,
            balance: 0,
          },
        ],
      },
      account: {
        balance,
        publicKey,
        network: null,
      },
    };
    store.getState = () => state;

    next = spy();
    getAccountStub = mock(accountApi);
  });

  afterEach(() => {
    getAccountStub.restore();
  });

  it('should pass the action to next middleware', () => {
    const randomAction = {
      type: 'SOME_ACTION',
      data: { something: true },
    };

    middleware(store)(next)(randomAction);
    expect(next).to.have.been.calledWith(randomAction);
  });

  it(`should dispatch accountLoading action on ${actionTypes.accountSwitched} action`, () => {
    const action = {
      type: actionTypes.accountSwitched,
      data: {
        publicKey,
        network: networks.mainnet.code,
      },
    };
    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(accountLoading());
  });

  it(`should call activePeerSet action on ${actionTypes.accountSwitched} action`, () => {
    const { code } = networks.customNode;
    const peersActionsMock = mock(peersActions);
    peersActionsMock.expects('activePeerSet').withExactArgs(match({
      network: {
        address,
        code,
      },
      publicKey,
    }));

    const action = {
      type: actionTypes.accountSwitched,
      data: {
        publicKey,
        network: code,
        peerAddress: address,
      },
    };
    middleware(store)(next)(action);

    peersActionsMock.verify();
  });

  it(`should dispatch accountSaved action on ${actionTypes.accountLoggedIn} action if given account is not saved yet`, () => {
    const action = {
      type: actionTypes.accountLoggedIn,
      data: {
        publicKey: publicKey2,
        balance,
        passphrase,
      },
    };
    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(accountSaved({
      passphrase,
      peerAddress: undefined,
      balance,
      network: networks.mainnet.code,
      publicKey: publicKey2,
    }));
  });

  it(`should dispatch accountSaved action on ${actionTypes.activeAccountSaved} action if given account is not saved yet`, () => {
    state.account = {
      publicKey: publicKey2,
      balance,
    };
    store.getState = () => state;
    const action = {
      type: actionTypes.activeAccountSaved,
    };
    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(accountSaved({
      peerAddress: undefined,
      balance,
      network: networks.mainnet.code,
      publicKey: publicKey2,
    }));
  });

  it(`should dispatch accountRemoved action on ${actionTypes.accountLoggedOut} action if given account is logged in`, () => {
    state.account = {
      publicKey: publicKey2,
      balance,
    };

    state.savedAccounts = {
      accounts: [],
    };

    store.getState = () => state;
    const action = {
      type: actionTypes.accountRemoved,
    };
    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(accountLoggedOut());
  });

  it('should make a request for the account information, if a relevant transaction was made', () => {
    getAccountStub.expects('getAccount').withArgs(match.any, '1155682438012955434L').returnsPromise().resolves({ balance: 1 });
    const transactions = { transactions: [{ senderId: '1234L', recipientId: '1155682438012955434L' }] };
    middleware(store)(next)({
      type: actionTypes.newBlockCreated,
      data: { block: transactions },
    });

    expect(store.dispatch).to.have.been.calledWith({
      data: {
        accounts: state.savedAccounts.accounts,
        lastActive: match.any,
      },
      type: actionTypes.accountsRetrieved,
    });
  });

  it('should make only one request for the account information, if several transactions for the same account were made', () => {
    getAccountStub.expects('getAccount').withArgs(match.any, '1155682438012955434L').returnsPromise().resolves({ balance: 1 });
    const transactions = {
      transactions: [{ senderId: '1234L', recipientId: '1155682438012955434L' },
        { senderId: '1234L', recipientId: '1155682438012955434L' }],
    };

    middleware(store)(next)({
      type: actionTypes.newBlockCreated,
      data: { block: transactions },
    });

    // eslint-disable-next-line no-unused-expressions
    expect(store.dispatch).to.have.been.calledOnce;
    expect(store.dispatch).to.have.been.calledWith({
      data: {
        accounts: state.savedAccounts.accounts,
        lastActive: match.any,
      },
      type: actionTypes.accountsRetrieved,
    });
  });

  it('should not make a request for the account information, if no relevant transaction was made', () => {
    getAccountStub.expects('getAccount').withArgs(match.any, '1155682438012955434L').returnsPromise().resolves({ balance: 1 });
    const transactions = { transactions: [{ senderId: '1234L', recipientId: '4321L' }] };
    middleware(store)(next)({
      type: actionTypes.newBlockCreated,
      data: { block: transactions },
    });

    expect(store.dispatch).to.not.have.been.calledWith();
  });

  it('should make a request for the account information, when account logged in', () => {
    getAccountStub.expects('getAccount').withArgs(match.any, '1155682438012955434L').returnsPromise().resolves({ balance: 1 });
    middleware(store)(next)({
      type: actionTypes.accountLoggedIn,
      data: {
        publicKey,
        balance,
        passphrase,
      },
    });

    expect(store.dispatch).to.have.been.calledWith({
      data: {
        accounts: state.savedAccounts.accounts,
        lastActive: match.any,
      },
      type: actionTypes.accountsRetrieved,
    });
  });
});
