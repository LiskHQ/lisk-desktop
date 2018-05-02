import i18next from 'i18next';
import actionTypes from '../constants/actions';
import { setSecondPassphrase, send, getAccount } from '../utils/api/account';
import { registerDelegate, getDelegate } from '../utils/api/delegate';
import { transactionAdded, transactionFailed, loadTransactionsFinish } from './transactions';
import { delegateRegisteredFailure } from './delegate';
import { errorAlertDialogDisplayed } from './dialog';
import Fees from '../constants/fees';
import { toRawLsk } from '../utils/lsk';
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
 *
 */
export const secondPassphraseRegistered = ({ activePeer, secondPassphrase, account, passphrase }) =>
  (dispatch) => {
    setSecondPassphrase(activePeer, secondPassphrase, account.publicKey, passphrase)
      .then((data) => {
        dispatch(transactionAdded({
          id: data.transactionId,
          senderPublicKey: account.publicKey,
          senderId: account.address,
          amount: 0,
          fee: Fees.setSecondPassphrase,
          type: transactionTypes.setSecondPassphrase,
        }));
      }).catch((error) => {
        const text = (error && error.message) ? error.message : i18next.t('An error occurred while registering your second passphrase. Please try again.');
        dispatch(errorAlertDialogDisplayed({ text }));
      });
    dispatch(passphraseUsed(passphrase));
  };

/**
 *
 */
export const delegateRegistered = ({
  activePeer, account, passphrase, username, secondPassphrase }) =>
  (dispatch) => {
    registerDelegate(activePeer, username, passphrase, secondPassphrase)
      .then((data) => {
        // dispatch to add to pending transaction
        dispatch(transactionAdded({
          id: data.transactionId,
          senderPublicKey: account.publicKey,
          senderId: account.address,
          username,
          amount: 0,
          fee: Fees.registerDelegate,
          type: transactionTypes.registerDelegate,
        }));
      })
      .catch((error) => {
        dispatch(delegateRegisteredFailure(error));
      });
    dispatch(passphraseUsed(passphrase));
  };

/**
 *
 */
export const sent = ({ activePeer, account, recipientId, amount, passphrase, secondPassphrase }) =>
  (dispatch) => {
    send(activePeer, recipientId, toRawLsk(amount), passphrase, secondPassphrase)
      .then((data) => {
        dispatch(transactionAdded({
          id: data.transactionId,
          senderPublicKey: account.publicKey,
          senderId: account.address,
          recipientId,
          amount: toRawLsk(amount),
          fee: Fees.send,
          type: transactionTypes.send,
        }));
      })
      .catch((error) => {
        const errorMessage = error && error.message ? `${error.message}.` : i18next.t('An error occurred while creating the transaction.');
        dispatch(transactionFailed({ errorMessage }));
      });
    dispatch(passphraseUsed(passphrase));
  };


export const updateDelegate = data => ({
  type: actionTypes.updateDelegate,
  data,
});

export const loadDelegate = ({ activePeer, publicKey }) =>
  (dispatch) => {
    getDelegate(
      activePeer, { publicKey },
    ).then((response) => {
      dispatch(updateDelegate({ delegate: response.delegate }));
    });
  };

export const loadAccount = ({
  activePeer,
  address,
  transactionsResponse,
  isSameAccount }) =>

  (dispatch) => {
    getAccount(activePeer, address)
      .then((response) => {
        let accountDataUpdated = {
          confirmed: transactionsResponse.transactions,
          count: parseInt(transactionsResponse.count, 10),
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
