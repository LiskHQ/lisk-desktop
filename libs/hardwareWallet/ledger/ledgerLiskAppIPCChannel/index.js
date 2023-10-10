import { Queue } from 'async-await-queue';
import { LEDGER_HW_IPC_CHANNELS } from '@libs/hardwareWallet/ledger/constants';
import {
  createIpcMainChannel,
  getSequentiallyQueuedData,
} from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/utils';
import {
  getPubKey,
  getConnectedDevices,
  getSignedMessage,
  getSignedTransaction,
  getMultipleAddresses,
} from './serverLedgerHWCommunication';

const {
  GET_CONNECTED_DEVICES,
  GET_SIGNED_MESSAGE,
  GET_PUB_KEY,
  GET_MULTIPLE_ADDRESSES,
  GET_SIGNED_TRANSACTION,
  RESET_LEDGER_IPC_QUEUE,
} = LEDGER_HW_IPC_CHANNELS;

export const ledgerLiskAppIPCChannel = () => {
  let myq = new Queue();

  createIpcMainChannel(GET_SIGNED_TRANSACTION, async (data) => {
    const id = `${GET_SIGNED_TRANSACTION}-${Date.now()}`;
    const result = await getSequentiallyQueuedData(myq, id, () => getSignedTransaction(data));
    return result;
  });

  createIpcMainChannel(GET_SIGNED_MESSAGE, async (data) => {
    const id = `${GET_SIGNED_MESSAGE}-${Date.now()}`;
    const result = await getSequentiallyQueuedData(myq, id, () => getSignedMessage(data));
    return result;
  });

  createIpcMainChannel(GET_PUB_KEY, async (data) => {
    const id = `${GET_PUB_KEY}-${Date.now()}`;
    const result = await getSequentiallyQueuedData(myq, id, () => getPubKey(data));
    return result;
  });

  createIpcMainChannel(GET_MULTIPLE_ADDRESSES, async (data) => {
    const id = `${GET_MULTIPLE_ADDRESSES}-${Date.now()}`;
    const result = await getSequentiallyQueuedData(myq, id, () => getMultipleAddresses(data));
    return result;
  });

  createIpcMainChannel(RESET_LEDGER_IPC_QUEUE, async () => {
    try {
      myq = new Queue();
      return true;
    } catch (e) {
      return false;
    }
  });

  createIpcMainChannel(GET_CONNECTED_DEVICES, async () => {
    const id = `${GET_CONNECTED_DEVICES}-${Date.now()}`;
    const result = await getSequentiallyQueuedData(myq, id, getConnectedDevices);
    return result;
  });
};
