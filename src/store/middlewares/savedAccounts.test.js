import { expect } from 'chai';
import { spy, mock, match } from 'sinon';

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
  const address = 'https://testnet.lisk.io';
  const passphrase = 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit';
  const publicKey = 'fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88';
  const balance = 10e8;

  beforeEach(() => {
    store = mock();
    store.dispatch = spy();
    state = {
      peers: {
        options: {
          code: networks.mainnet.code,
        },
      },
      savedAccounts: {
        accounts: [
          {
            publicKey,
            network: networks.mainnet.code,
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
        address,
      },
    };
    middleware(store)(next)(action);

    peersActionsMock.verify();
  });

  it(`should dispatch accountSaved action on ${actionTypes.accountLoggedIn} action if given account is not saved yet`, () => {
    const publicKey2 = 'hab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88';
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
      address: undefined,
      balance,
      network: networks.mainnet.code,
      publicKey: publicKey2,
    }));
  });

  it(`should dispatch accountSaved action on ${actionTypes.activeAccountSaved} action if given account is not saved yet`, () => {
    const publicKey2 = 'hab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88';
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
      address: undefined,
      balance,
      network: networks.mainnet.code,
      publicKey: publicKey2,
    }));
  });

  it(`should dispatch accountRemoved action on ${actionTypes.accountLoggedOut} action if given account is logged in`, () => {
    const publicKey2 = 'hab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88';
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
});
