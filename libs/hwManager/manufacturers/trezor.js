/* istanbul ignore file */
/* eslint-disable no-bitwise */
// TODO remove this line once we add constants file for this module
import { models } from '../../../src/constants/hwConstants';

const listener = (transport, actions) => {
  // TODO use contants instead of hardcoded text
  transport.on('connect', (device) => {
    actions.add({
      deviceId: device.features.device_id,
      label: device.features.label,
      model: device.features.model === '1' ? models.trezorOne : models.trezorModelT,
      path: device.originalDescriptor.path,
      manufactor: 'trezor', // TODO use contants instead of hardcoded text
    });
  });

  // TODO use contants instead of hardcoded text
  transport.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error('Trezor Error: ', error);
  });

  // TODO use contants instead of hardcoded text
  transport.on('disconnect', (device) => {
    actions.remove(device.originalDescriptor.path);
  });

  // TODO use contants instead of hardcoded text
  process.on('exit', () => {
    transport.onbeforeunload();
  });
};

// TODO move this to utils file
const hardeningConstant = 0x80000000;
const getHardenedPath = index => [
  (44 | hardeningConstant) >>> 0,
  (134 | hardeningConstant) >>> 0,
  (index | hardeningConstant) >>> 0,
];

// eslint-disable-next-line max-statements
const toTrezorGrammar = (tx) => {
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

// TODO after move the logic of each event to separate functions we can remove
// the eslint for max statements
const executeCommand = (transporter, {
  device,
  action,
  data,
}) => {
  const trezorDevice = transporter.asArray()
    .find(d => d.features.device_id === device.deviceId);
  if (!trezorDevice) {
    Promise.reject(new Error('DEVICE_IS_NOT_CONNECTED'));
  }

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line max-statements
    trezorDevice.waitForSessionAndRun(async (session) => {
      try {
        switch (action) {
          // TODO use contants instead of hardcoded text for events and move the logic to functions
          case 'GET_PUBLICKEY': {
            const { message } = await session.typedCall(
              'LiskGetPublicKey',
              'LiskPublicKey',
              {
                address_n: getHardenedPath(data.index),
                show_display: data.showOnDevice,
              },
            );
            return resolve(message.public_key);
          }

          // TODO use contants instead of hardcoded text for events and move the logic to functions
          case 'SIGN_TX': {
            const { message } = await session.typedCall(
              'LiskSignTx',
              'LiskSignedTx',
              {
                address_n: getHardenedPath(data.index),
                transaction: toTrezorGrammar(data.tx),
              },
            );
            return resolve(message.signature);
          }

          default: {
            // eslint-disable-next-line no-console
            console.log(`No action created for: ${device.manufactor}.${action}`);
            return reject(new Error(`No action created for: ${device.manufactor}.${action}`));
          }
        }
      } catch (err) {
        return reject();
      }
    });
  });
};

export default {
  listener,
  executeCommand,
};
