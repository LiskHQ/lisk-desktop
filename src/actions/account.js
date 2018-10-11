import i18next from 'i18next';
import actionTypes from '../constants/actions';
import { setSecondPassphrase, getAccount } from '../utils/api/account';
import { registerDelegate, getDelegate, getAlllVotes, getVoters } from '../utils/api/delegate';
import { loadTransactionsFinish, transactionsUpdated } from './transactions';
import { delegateRegisteredFailure } from './delegate';
import { errorAlertDialogDisplayed } from './dialog';
import { activePeerUpdate } from './peers';
import { getTimeOffset } from '../utils/hacks';
import Fees from '../constants/fees';
import transactionTypes from '../constants/transactionTypes';

/**
 * Trigger this action to remove passphrase from account object
 *
 * @param {Object} data - account data
 * @returns {Object} - Action object
 */
export const removePassphrase = data => ({
  data,
  type: actionTypes.removePassphrase,
});

/**
 * Trigger this action to update the account object
 * while already logged in
 *
 * @param {Object} data - account data
 * @returns {Object} - Action object
 */
export const accountUpdated = data => ({
  data,
  type: actionTypes.accountUpdated,
});

/**
 * Trigger this action to log out of the account
 * while already logged in
 *
 * @returns {Object} - Action object
 */
export const accountLoggedOut = () => ({
  type: actionTypes.accountLoggedOut,
});

/**
 * Trigger this action to login to an account
 * The login middleware triggers this action
 *
 * @param {Object} data - account data
 * @returns {Object} - Action object
 */
export const accountLoggedIn = data => ({
  type: actionTypes.accountLoggedIn,
  data,
});

export const accountLoading = () => ({
  type: actionTypes.accountLoading,
});

export const passphraseUsed = data => ({
  type: actionTypes.passphraseUsed,
  data,
});

/**
 * Gets list of all votes
 */
export const accountVotesFetched = ({ address }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    return getAlllVotes(activePeer, address).then((votes) => {
      dispatch({
        type: actionTypes.accountAddVotes,
        votes,
      });
    });
  };

/**
 * Gets list of all voters
 */
export const accountVotersFetched = ({ publicKey }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    return getVoters(activePeer, publicKey).then(({ data }) => {
      dispatch({
        type: actionTypes.accountAddVoters,
        voters: data,
      });
    });
  };
/**
 *
 */
export const secondPassphraseRegistered = ({ secondPassphrase, account, passphrase }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    const timeOffset = getTimeOffset(getState());
    setSecondPassphrase(activePeer, secondPassphrase, account.publicKey, passphrase, timeOffset)
      .then((data) => {
        dispatch({
          data: {
            id: data.id,
            senderPublicKey: account.publicKey,
            senderId: account.address,
            amount: 0,
            fee: Fees.setSecondPassphrase,
            type: transactionTypes.setSecondPassphrase,
          },
          type: actionTypes.transactionAdded,
        });
      }).catch((error) => {
        const text = (error && error.message) ? error.message : i18next.t('An error occurred while registering your second passphrase. Please try again.');
        dispatch(errorAlertDialogDisplayed({ text }));
      });
    dispatch(passphraseUsed(passphrase));
  };

export const updateDelegateAccount = ({ publicKey }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    return getDelegate(activePeer, { publicKey })
      .then((response) => {
        dispatch(accountUpdated(Object.assign(
          {},
          { delegate: response.data[0], isDelegate: true },
        )));
      });
  };

/**
 *
 */
export const delegateRegistered = ({
  account, passphrase, username, secondPassphrase,
}) =>
  (dispatch, getState) => {
    const timeOffset = getTimeOffset(getState());
    const activePeer = getState().peers.data;
    registerDelegate(activePeer, username, passphrase, secondPassphrase, timeOffset)
      .then((data) => {
        // dispatch to add to pending transaction
        dispatch({
          data: {
            id: data.id,
            senderPublicKey: account.publicKey,
            senderId: account.address,
            username,
            amount: 0,
            fee: Fees.registerDelegate,
            type: transactionTypes.registerDelegate,
          },
          type: actionTypes.transactionAdded,
        });
      })
      .catch((error) => {
        dispatch(delegateRegisteredFailure(error));
      });
    dispatch(passphraseUsed(passphrase));
  };

export const loadDelegate = ({ publicKey }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    getDelegate(activePeer, { publicKey }).then((response) => {
      dispatch({
        data: {
          delegate: response.delegate,
        },
        type: actionTypes.updateDelegate,
      });
    });
  };

export const loadAccount = ({
  address,
  transactionsResponse,
  isSameAccount,
}) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    getAccount(activePeer, address)
      .then((response) => {
        let accountDataUpdated = {
          confirmed: transactionsResponse.data,
          count: parseInt(transactionsResponse.meta.count, 10),
          balance: response.balance,
          address,
        };

        if (!isSameAccount && response.publicKey) {
          dispatch(loadDelegate({
            publicKey: response.publicKey,
          }));
        } else if (isSameAccount && response.isDelegate) {
          accountDataUpdated = {
            ...accountDataUpdated,
            delegate: response.delegate,
          };
        }
        dispatch(loadTransactionsFinish(accountDataUpdated));
      });
  };

export const updateTransactionsIfNeeded = ({ transactions, account }, windowFocus) =>
  (dispatch) => {
    const hasRecentTransactions = txs => (
      txs.confirmed.filter(tx => tx.confirmations < 1000).length !== 0 ||
      txs.pending.length !== 0
    );

    if (windowFocus || hasRecentTransactions(transactions)) {
      const { filter } = transactions;
      const address = transactions.account ? transactions.account.address : account.address;

      dispatch(transactionsUpdated({
        pendingTransactions: transactions.pending,
        address,
        limit: 25,
        filter,
      }));
    }
  };

export const accountDataUpdated = ({
  account, windowIsFocused, transactions,
}) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    getAccount(activePeer, account.address).then((result) => {
      if (result.balance !== account.balance) {
        dispatch(updateTransactionsIfNeeded(
          {
            transactions,
            account,
          },
          !windowIsFocused,
        ));
      }
      dispatch(accountUpdated(result));
      dispatch(activePeerUpdate({ online: true }));
    }).catch((res) => {
      dispatch(activePeerUpdate({ online: false, code: res.error.code }));
    });
  };
