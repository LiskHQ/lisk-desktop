import actionTypes from '../constants/actions';
import { setSecondPassphrase, send } from '../utils/api/account';
import { registerDelegate } from '../utils/api/delegate';
import { transactionAdded } from './transactions';
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
export const sent = ({ activePeer, account, recipientId, amount, passphrase, secondPassphrase }) =>
  (dispatch) => {
    send(activePeer, recipientId, toRawLsk(amount), passphrase, secondPassphrase)
      .then((data) => {
        dispatch(transactionAdded({
          id: data.transactionId,
          senderPublicKey: account.publicKey,
          senderId: account.address,
          recipientId,
          amount,
          fee: Fees.send,
        }));
      });
  };
