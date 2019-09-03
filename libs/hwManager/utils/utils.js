/* eslint-disable no-bitwise */
/* istanbul ignore file */
import Lisk from '@liskhq/lisk-client';

/**
 * Create a listener to a function that send a response back to the sender
 * @param {any} subscriber - Subscriber that will listen to the event
 * @param {Object} data - Object containing  the command and fn
 * @param {string} data.command - Event name to be listened to
 * @param {function} data.fn - Function to be executed when event is triggered
 */
export const createCommand = (subscriber, { command, fn }) => {
  subscriber.on(`${command}.request`, async (event, ...args) => {
    Promise.resolve(fn(...args))
      .then(result => ({ success: true, data: result }))
      .catch(error => ({ success: false, data: error }))
      .then(result => event.sender.send(`${command}.result`, result));
  });
};

/**
 * Publish a event throught the sender in this.pubSub
 * @param {any} sender - Sender that will trigger the event
 * @param {object} data - Object with event name and payload to be sent
 * @param {string} data.event - Event to be published throught the sender
 * @param {any} data.payload - Payload to be sent to with the event
 */
export const publish = (sender, { event, payload }) => {
  if (!sender) return false;
  sender.send({ event, value: payload });
  return true;
};

/**
 * Subscribe to a event throught the receiver
 * @param {any} receiver - Subscriber that should be subscribed to the the event
 * @param {object} data - Object containing the event and the action
 * @param {string} data.event - Event name to be subscribed to thoguht the receiver
 * @param {function} data.action - Function that should be executed when event is triggered
 */
export const subscribe = (receiver, { event, action }) => {
  if (!receiver) return false;
  createCommand(receiver, {
    command: event,
    fn: action,
  });
  return true;
};

// ===================================================== //
//                   LEDGER UTILS
// ===================================================== //
export const getTransactionBytes = transaction =>
  Lisk.transaction.utils.getTransactionBytes(transaction);

export const getBufferToHex = buffer => Lisk.cryptography.bufferToHex(buffer);


// ===================================================== //
//                   TREZOR UTILS
// ===================================================== //
export const getHardenedPath = (index) => {
  const hardeningConstant = 0x80000000;
  return [
    (44 | hardeningConstant) >>> 0,
    (134 | hardeningConstant) >>> 0,
    (index | hardeningConstant) >>> 0,
  ];
};

// eslint-disable-next-line max-statements
export const toTrezorGrammar = (tx) => {
  if (tx.amount) tx.amount = parseInt(tx.amount, 10);
  if (tx.fee) tx.fee = parseInt(tx.fee, 10);
  if (tx.recipientId === '') delete tx.recipientId;
  if (tx.recipientId) {
    tx.recipient_id = tx.recipientId;
    delete tx.recipientId;
  }
  if (tx.senderPublicKey) {
    tx.sender_public_key = tx.senderPublicKey;
    delete tx.senderPublicKey;
  }
  if (tx.requesterPublicKey) {
    tx.requester_public_key = tx.requesterPublicKey;
    delete tx.requesterPublicKey;
  }
  if (tx.asset) {
    if (tx.asset.signature && tx.asset.signature.publicKey) {
      tx.asset.signature.public_key = tx.asset.signature.publicKey;
      delete tx.asset.signature.publicKey;
    }
  }
  return tx;
};

export default {
  createCommand,
  publish,
  subscribe,
  getTransactionBytes,
  getBufferToHex,
};
