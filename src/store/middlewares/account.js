import {
  accountDataUpdated,
  updateDelegateAccount,
  updateTransactionsIfNeeded,
} from '../../actions/account';
import { loadVotes } from '../../actions/voting';
import {
  loadTransactions,
  cleanTransactions,
} from '../../actions/transactions';
import actionTypes from '../../constants/actions';
import transactionTypes from '../../constants/transactionTypes';

import { getActiveTokenAccount } from '../../utils/account';
import { getAutoLogInData, shouldAutoLogIn } from '../../utils/login';
import { liskAPIClientSet, liskAPIClientUpdate } from '../../actions/peers';
import networks from '../../constants/networks';
import settings from '../../constants/settings';
import txFilters from '../../constants/transactionFilters';

import { setWalletsInLocalStorage } from '../../utils/wallets';

import { getDeviceList, getHWPublicKeyFromIndex } from '../../utils/hwWallet';
import { loginType } from '../../constants/hwConstants';

const updateAccountData = (store, action) => {
  const { transactions } = store.getState();
  const account = getActiveTokenAccount(store.getState());

  store.dispatch(accountDataUpdated({
    windowIsFocused: action.data.windowIsFocused,
    transactions,
    account,
  }));

  /**
   * NOTE: dashboard transactionsList are not loaded when rendering the component,
   *  as this component just reads transactions from state.
   *  When autologin in, we need to explicitly request the transactions for that account.
   *
   *  Ignoring coverage because autologin is a development feature not accessible by end users
   */
  /* istanbul ignore if */
  if (shouldAutoLogIn(getAutoLogInData())) {
    store.dispatch(loadTransactions({
      address: account.address,
      filter: txFilters.all,
    }));
  }
};

const getRecentTransactionOfType = (transactionsList, type) => (
  transactionsList.filter(transaction => (
    transaction.type === type &&
    // limit the number of confirmations to 5 to not fire each time there is another new transaction
    // theoretically even less then 5, but just to be on the safe side
    transaction.confirmations < 5))[0]
);

const delegateRegistration = (store, action) => {
  const delegateRegistrationTx = getRecentTransactionOfType(
    action.data.confirmed,
    transactionTypes.registerDelegate,
  );
  const state = store.getState();

  if (delegateRegistrationTx) {
    store.dispatch(updateDelegateAccount({
      publicKey: state.account.info.LSK.publicKey,
    }));
  }
};

const votePlaced = (store, action) => {
  const voteTransaction = getRecentTransactionOfType(action.data.confirmed, transactionTypes.vote);

  if (voteTransaction) {
    const state = store.getState();
    const { account } = state;

    store.dispatch(loadVotes({
      address: account.address,
      type: 'update',
    }));
  }
};

const checkTransactionsAndUpdateAccount = (store, action) => {
  const state = store.getState();
  const { transactions, settings: { token } } = state;
  const account = getActiveTokenAccount(store.getState());
  // Adding timeout explained in
  // https://github.com/LiskHQ/lisk-hub/pull/1609
  setTimeout(() => {
    store.dispatch(updateTransactionsIfNeeded(
      {
        transactions,
        account,
      },
      action.data.windowIsFocused,
    ));
  }, 500);

  const txs = action.data.block.transactions || [];
  const blockContainsRelevantTransaction = txs.filter((transaction) => {
    const sender = transaction ? transaction.senderId : null;
    const recipient = transaction ? transaction.recipientId : null;
    return account.address === recipient || account.address === sender;
  }).length > 0;

  const recentBtcTransaction = token.active === 'BTC' &&
    transactions.confirmed.filter(t => t.confirmations === 1).length > 0;

  if (blockContainsRelevantTransaction || recentBtcTransaction) {
    // it was not getting the account with secondPublicKey right
    // after a new block with second passphrase registration transaction was received
    setTimeout(() => {
      updateAccountData(store, action);
    }, 500);
  }
};

const autoLogInIfNecessary = async (store) => {
  const autologinData = getAutoLogInData();
  if (shouldAutoLogIn(autologinData)) {
    store.dispatch(liskAPIClientSet({
      passphrase: autologinData[settings.keys.loginKey],
      network: { ...networks.customNode, address: autologinData[settings.keys.liskCoreUrl] },
      options: {
        code: networks.customNode.code,
        address: autologinData[settings.keys.liskCoreUrl],
      },
    }));
    store.dispatch(liskAPIClientUpdate({
      online: true,
    }));

  //  Ignoring coverage because autologin is a development feature not accessible by end users
  } else /* istanbul ignore next */ if (localStorage.getItem('hwWalletAutoLogin')) {
    const device = (await getDeviceList())[0];

    if (device) {
      const hwWalletType = /trezor/ig.test(device.deviceModel) ? loginType.trezor : loginType.ledger;
      const publicKey = await getHWPublicKeyFromIndex(device.deviceId, hwWalletType, 0);
      store.dispatch(liskAPIClientSet({
        hwInfo: {
          derivationIndex: 0,
          deviceId: device.deviceId,
          deviceModel: device.model,
        },
        publicKey,
        network: { ...networks.customNode, address: autologinData[settings.keys.liskCoreUrl] },
        options: {
          code: networks.customNode.code,
          address: autologinData[settings.keys.liskCoreUrl],
        },
      }));
      store.dispatch(liskAPIClientUpdate({
        online: true,
      }));
    }
  }
};

const accountMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.storeCreated:
      autoLogInIfNecessary(store, next, action);
      break;
    // update on login because the 'save account' button
    // depends on a rerendering of the page
    // TODO: fix the 'save account' path problem, so we can remove this
    case actionTypes.accountLoggedIn:
      updateAccountData(store, action);
      break;
    case actionTypes.newBlockCreated:
      checkTransactionsAndUpdateAccount(store, action);
      break;
    case actionTypes.updateTransactions:
      delegateRegistration(store, action);
      votePlaced(store, action);
      break;
    case actionTypes.accountLoggedOut:
      setWalletsInLocalStorage(store.getState().wallets);
      store.dispatch(cleanTransactions());
      localStorage.removeItem('accounts');
      localStorage.removeItem('isHarwareWalletConnected');
      break;
    /* istanbul ignore next */
    default: break;
  }
};

export default accountMiddleware;
