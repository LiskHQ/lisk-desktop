import { expect } from 'chai';
import { spy, mock, match } from 'sinon';

import { accountLoggedOut } from '../../actions/account';
import * as peersActions from '../../actions/peers';
import { successToastDisplayed } from '../../actions/toaster';
import actionTypes from '../../constants/actions';
import middleware from './savedAccounts';

describe('SavedAccounts middleware', () => {
  let store;
  let next;
  const address = 'https://testnet.lisk.io';
  const publicKey = 'fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88';

  beforeEach(() => {
    store = mock();
    store.dispatch = spy();
    store.getState = () => ({});

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

  it(`should dispatch successToastDisplayed action on ${actionTypes.accountSaved} action`, () => {
    const action = {
      type: actionTypes.accountSaved,
      data: {},
    };
    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(successToastDisplayed({ label: 'Account saved' }));
  });

  it(`should dispatch successToastDisplayed action on ${actionTypes.accountRemoved} action`, () => {
    const action = {
      type: actionTypes.accountRemoved,
      data: {},
    };
    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(successToastDisplayed({ label: 'Account was successfully forgotten.' }));
  });

  it(`should dispatch accountLoggedOut action on ${actionTypes.accountSwitched} action`, () => {
    const action = {
      type: actionTypes.accountSwitched,
      data: {
        publicKey,
        network: 0,
      },
    };
    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(accountLoggedOut());
  });

  it(`should call activePeerSet action on ${actionTypes.accountSwitched} action`, () => {
    const code = 2;
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
});
