import i18next from 'i18next';
import actionTypes from '../constants/actions';
import { setSecondPassphrase, getAccount } from '../utils/api/account';
import { registerDelegate, getDelegate, getVotes, getVoters } from '../utils/api/delegate';
import { loadTransactionsFinish, transactionsUpdated } from './transactions';
import { delegateRegisteredFailure } from './delegate';
import { errorAlertDialogDisplayed } from './dialog';
import { activePeerUpdate } from './peers';
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
export const accountVotesFetched = ({ activePeer, address }) =>
  dispatch =>
    getVotes(activePeer, address).then(({ data }) => {
      dispatch({
        type: actionTypes.accountAddVotes,
        votes: data.votes,
      });
    });

/**
 * Gets list of all voters
 */
export const accountVotersFetched = ({ activePeer, publicKey }) =>
  dispatch =>
    getVoters(activePeer, publicKey).then(({ data }) => {
      dispatch({
        type: actionTypes.accountAddVoters,
        voters: data,
      });
    });
/**
 *
 */
export const secondPassphraseRegistered = ({
  activePeer, secondPassphrase, account, passphrase,
}) =>
  (dispatch) => {
    setSecondPassphrase(activePeer, secondPassphrase, account.publicKey, passphrase)
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


export const updateDelegateAccount = ({ activePeer, publicKey }) =>
  (dispatch) => {
    getDelegate(activePeer, { publicKey })
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
  activePeer, account, passphrase, username, secondPassphrase,
}) =>
  (dispatch) => {
    registerDelegate(activePeer, username, passphrase, secondPassphrase)
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

export const loadDelegate = ({ activePeer, publicKey }) =>
  (dispatch) => {
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
  activePeer,
  address,
  transactionsResponse,
  isSameAccount,
}) =>
  (dispatch) => {
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
            activePeer,
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

export const updateTransactionsIfNeeded = ({ transactions, activePeer, account }, windowFocus) =>
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
        activePeer,
        address,
        limit: 25,
        filter,
      }));
    }
  };

export const accountDataUpdated = ({
  peers, account, windowIsFocused, transactions,
}) =>
  (dispatch) => {
    getAccount(peers.data, account.address).then((result) => {
      if (result.balance !== account.balance) {
        dispatch(updateTransactionsIfNeeded(
          {
            transactions,
            activePeer: peers.data,
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
