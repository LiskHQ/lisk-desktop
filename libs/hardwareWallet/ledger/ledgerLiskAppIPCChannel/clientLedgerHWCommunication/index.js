import { executeIPCCommand } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication/utils';
import { LEDGER_HW_IPC_CHANNELS } from '@libs/hardwareWallet/ledger/constants';

const { GET_CONNECTED_DEVICES, GET_SIGNED_TRANSACTION, GET_PUB_KEY, GET_SIGNED_MESSAGE } =
  LEDGER_HW_IPC_CHANNELS;

// TODO: remove when server have a queuing system
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
  const signedTransaction = await executeIPCCommand(GET_SIGNED_MESSAGE, {
    devicePath,
    accountIndex,
    unsignedMessage,
  });

  return signedTransaction;
};

export const getPubKey = async (devicePath, accountIndex) => {
  const pubKey = await executeIPCCommand(GET_PUB_KEY, {
    devicePath,
    accountIndex,
  });

  return pubKey;
};

export const getIsInsideLiskApp = async (devicePath, accountIndex) => {
  const pubKey = await getPubKey(devicePath, accountIndex);

  return !!pubKey;
};

export const getConnectedHWDevices = async () => {
  await sleep(1500);
  const signedTransaction = await executeIPCCommand(GET_CONNECTED_DEVICES);
  return signedTransaction;
};
