import { accountUpdated,
  accountDataUpdated,
  updateTransactionsIfNeeded,
  updateDelegateAccount,
} from '../../actions/account';
import { votesFetched } from '../../actions/voting';
import { transactionsFilterSet } from '../../actions/transactions';
import actionTypes from '../../constants/actions';
import accountConfig from '../../constants/account';
import transactionTypes from '../../constants/transactionTypes';

import { extractAddress, extractPublicKey } from '../../utils/account';
import { getAutoLogInData, shouldAutoLogIn } from '../../utils/login';
import { activePeerSet, activePeerUpdate } from '../../actions/peers';
import networks from '../../constants/networks';
import settings from '../../constants/settings';
import txFilters from '../../constants/transactionFilters';

const { lockDuration } = accountConfig;

const updateAccountData = (store, action) => {
  const { account, transactions } = store.getState();

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
  if (shouldAutoLogIn(getAutoLogInData()) && action.data.passphrase) {
    store.dispatch(transactionsFilterSet({
      address: extractAddress(extractPublicKey(action.data.passphrase)),
      limit: 25,
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
      publicKey: state.account.publicKey,
    }));
  }
};

const votePlaced = (store, action) => {
  const voteTransaction = getRecentTransactionOfType(action.data.confirmed, transactionTypes.vote);

  if (voteTransaction) {
    const state = store.getState();
    const { account } = state;

    store.dispatch(votesFetched({
      address: account.address,
      type: 'update',
    }));
  }
};

const passphraseUsed = (store, action) => {
  const data = { expireTime: Date.now() + lockDuration };

  if (!store.getState().account.passphrase) {
    data.passphrase = action.data;
  }

  store.dispatch(accountUpdated(data));
};

const checkTransactionsAndUpdateAccount = (store, action) => {
  const state = store.getState();
  const { account, transactions } = state;

  store.dispatch(updateTransactionsIfNeeded(
    {
      transactions,
      account,
    },
    action.data.windowIsFocused,
  ));

  const tx = action.data.block.transactions || [];
  const accountAddress = state.account.address;
  const blockContainsRelevantTransaction = tx.filter((transaction) => {
    const sender = transaction ? transaction.senderId : null;
    const recipient = transaction ? transaction.recipientId : null;
    return accountAddress === recipient || accountAddress === sender;
  }).length > 0;

  if (blockContainsRelevantTransaction) {
    // it was not getting the account with secondPublicKey right
    // after a new block with second passphrase registration transaction was received
    setTimeout(() => {
      updateAccountData(store, action);
    }, 5000);
  }
};

const autoLogInIfNecessary = (store) => {
  const autologinData = getAutoLogInData();
  if (shouldAutoLogIn(autologinData)) {
    store.dispatch(activePeerSet({
      passphrase: autologinData[settings.keys.autologinKey],
      network: { ...networks.customNode, address: autologinData[settings.keys.autologinUrl] },
      options: {
        code: networks.customNode.code,
        address: autologinData[settings.keys.autologinUrl],
      },
    }));
    store.dispatch(activePeerUpdate({
      online: true,
    }));
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
    case actionTypes.transactionsUpdated:
      delegateRegistration(store, action);
      votePlaced(store, action);
      break;
    case actionTypes.passphraseUsed:
      passphraseUsed(store, action);
      break;
    case actionTypes.accountLoggedOut:
      localStorage.removeItem('accounts');
      break;
    default: break;
  }
};

export default accountMiddleware;
