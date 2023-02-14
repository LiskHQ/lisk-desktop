import {
  bookmarkAdded, bookmarkUpdated, bookmarkRemoved,
} from 'src/redux/actions';
import wallets from '@tests/constants/wallets';
import actionTypes from './actionTypes';
import bookmarks from './reducer';

// eslint-disable-next-line camelcase
const { genesis, validator, empty_wallet } = wallets;

describe('Reducer: bookmarks(state, action)', () => {
  const wallet = {
    address: genesis.summary.address,
    title: genesis.summary.address,
    publicKey: genesis.summary.publicKey,
  };
  const wallet2 = {
    address: validator.summary.address,
    title: genesis.summary.address,
    publicKey: validator.summary.publicKey,
  };

  it(`should return wallets with added wallet if action.type is ${actionTypes.bookmarkAdded}`, () => {
    const wallet3 = {
      address: empty_wallet.summary.address,
      title: empty_wallet.summary.address,
      publicKey: empty_wallet.summary.publicKey,
    };

    const state = { LSK: [wallet, wallet2] };
    const action = bookmarkAdded({ wallet: wallet3, token: 'LSK' });
    const changedState = bookmarks(state, action);
    expect(changedState.LSK[0]).toEqual(wallet3);
    expect(changedState.LSK[1]).toEqual(wallet);
    expect(changedState.LSK[2]).toEqual(wallet2);
  });

  it(`should return wallets with added wallet and trimmed title if action.type is ${actionTypes.bookmarkAdded}`, () => {
    const wallet3 = {
      address: empty_wallet.summary.address,
      title: empty_wallet.summary.address,
      publicKey: empty_wallet.summary.publicKey,
    };

    const state = { LSK: [wallet, wallet2] };
    const action = bookmarkAdded({
      wallet: {
        ...wallet3,
        title: `     ${wallet3.title}    `,
      },
      token: 'LSK',
    });
    const changedState = bookmarks(state, action);
    expect(changedState.LSK[0]).toEqual(wallet3);
    expect(changedState.LSK[1]).toEqual(wallet);
    expect(changedState.LSK[2]).toEqual(wallet2);
  });

  it(`should return wallets with updated wallet if action.type is ${actionTypes.bookmarkUpdated}`, () => {
    const updatedWallet = {
      address: validator.summary.address,
      title: 'bob',
      publicKey: validator.summary.publicKey,
    };

    const state = { LSK: [wallet, wallet2] };
    const action = bookmarkUpdated({ wallet: updatedWallet });

    const changedState = bookmarks(state, action);

    expect(changedState.LSK[0]).toEqual(wallet);
    expect(changedState.LSK[1]).toEqual(updatedWallet);
  });

  it(`should return wallets with updated wallet and trimmed title if action.type is ${actionTypes.bookmarkUpdated}`, () => {
    const updatedWallet = {
      address: validator.summary.address,
      title: 'bob',
      publicKey: validator.summary.publicKey,
    };

    const state = { LSK: [wallet, wallet2] };
    const action = bookmarkUpdated({
      wallet: {
        ...updatedWallet,
        title: '     bob     ',
      },
    });

    const changedState = bookmarks(state, action);

    expect(changedState.LSK[0]).toEqual(wallet);
    expect(changedState.LSK[1]).toEqual(updatedWallet);
  });

  it(`should return wallets without deleted wallet if action.type is ${actionTypes.bookmarkRemoved}`, () => {
    const state = { LSK: [wallet, wallet2] };
    const action = bookmarkRemoved({ address: wallet2.address, token: 'LSK' });

    const changedState = bookmarks(state, action);

    expect(changedState.LSK[0]).toEqual(wallet);
    expect(changedState.LSK[1]).toEqual(undefined);
  });

  it('should return validated bookmarks if action.type = actionType.bookmarksRetrieved', () => {
    const action = {
      type: actionTypes.bookmarksRetrieved,
      data: { LSK: [wallet, wallet2] },
    };

    let state;

    const changedState = bookmarks(state, action);
    expect(changedState).toEqual(action.data);
  });
});
