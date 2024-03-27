import { executeIPCCommand } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication/utils';
import { LEDGER_HW_IPC_CHANNELS } from '@libs/hardwareWallet/ledger/constants';

const {
  GET_CONNECTED_DEVICES,
  RESET_LEDGER_IPC_QUEUE,
  GET_SIGNED_TRANSACTION,
  GET_PUB_KEY,
  GET_MULTIPLE_ADDRESSES,
  GET_SIGNED_MESSAGE,
  GET_SIGNED_RAW_MESSAGE,
} = LEDGER_HW_IPC_CHANNELS;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getSignedTransaction = async (devicePath, accountIndex, unsignedMessage) => {
  const signedTransaction = await executeIPCCommand(GET_SIGNED_TRANSACTION, {
    devicePath,
    accountIndex,
    unsignedMessage,
  });

  return signedTransaction;
};

export const getSignedMessage = async (devicePath, accountIndex, unsignedMessage) => {
  const signedMessage = await executeIPCCommand(GET_SIGNED_MESSAGE, {
    devicePath,
    accountIndex,
    unsignedMessage,
  });

  return signedMessage;
};

export const getSignedRawMessage = async (devicePath, accountIndex, unsignedMessage) => {
  const signedRawMessage = await executeIPCCommand(GET_SIGNED_RAW_MESSAGE, {
    devicePath,
    accountIndex,
    unsignedMessage,
  });

  return signedRawMessage;
};

export const getPubKey = async (devicePath, accountIndex, showOnDevice) => {
  const pubKey = await executeIPCCommand(GET_PUB_KEY, {
    devicePath,
    accountIndex,
    showOnDevice,
  });

  return pubKey;
};

export const getMultipleAddresses = async (devicePath, accountIndexes) => {
  const addressesAndPubkeys = await executeIPCCommand(GET_MULTIPLE_ADDRESSES, {
    devicePath,
    accountIndexes,
  });

  return addressesAndPubkeys;
};

export const resetLedgerIPCQueue = async () => {
  await executeIPCCommand(RESET_LEDGER_IPC_QUEUE);
};

export const getIsInsideLiskApp = async (devicePath, accountIndex) => {
  try {
    const pubKey = await getPubKey(devicePath, accountIndex);

    return !!pubKey;
  } catch (e) {
    return false;
  }
};

export const getConnectedHWDevices = async () => {
  await sleep(1500);
  const connectedDevices = await executeIPCCommand(GET_CONNECTED_DEVICES);
  return connectedDevices;
};
