import actionTypes from '../constants/actions';
import { setSecondPassphrase, send } from '../utils/api/account';
import { registerDelegate } from '../utils/api/delegate';
import { transactionAdded } from './transactions';
import { errorAlertDialogDisplayed } from './dialog';
import Fees from '../constants/fees';
import { toRawLsk } from '../utils/lsk';

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

/**
 *
 */
export const secondPassphraseRegistered = ({ activePeer, secondPassphrase, account }) =>
  (dispatch) => {
    setSecondPassphrase(activePeer, secondPassphrase, account.publicKey, account.passphrase)
      .then((data) => {
        dispatch(transactionAdded({
          id: data.transactionId,
          senderPublicKey: account.publicKey,
          senderId: account.address,
          amount: 0,
          fee: Fees.setSecondPassphrase,
          type: 1,
        }));
      }).catch((error) => {
        const text = (error && error.message) ? error.message : 'An error occurred while registering your second passphrase. Please try again.';
        dispatch(errorAlertDialogDisplayed({ text }));
      });
  };

/**
 *
 */
export const delegateRegistered = ({ activePeer, account, username, secondPassphrase }) =>
  (dispatch) => {
    registerDelegate(activePeer, username, account.passphrase, secondPassphrase)
      .then((data) => {
        // dispatch to add to pending transaction
        dispatch(transactionAdded({
          id: data.transactionId,
          senderPublicKey: account.publicKey,
          senderId: account.address,
          username,
          amount: 0,
          fee: Fees.registerDelegate,
          type: 2,
        }));
      })
      .catch((error) => {
        const text = error && error.message ? `${error.message}.` : 'An error occurred while registering as delegate.';
        const actionObj = errorAlertDialogDisplayed({ text });
        dispatch(actionObj);
      });
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
          type: 0,
        }));
      })
      .catch((error) => {
        const text = error && error.message ? `${error.message}.` : 'An error occurred while creating the transaction.';
        dispatch(errorAlertDialogDisplayed({ text }));
      });
  };
