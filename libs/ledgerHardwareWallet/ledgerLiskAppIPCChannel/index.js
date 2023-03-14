import { Queue } from 'async-await-queue';
import { LEDGER_HW_IPC_CHANNELS } from '@libs/ledgerHardwareWallet/constants';
import {
  createIpcMainChannel,
  getSequentiallyQueuedData,
} from '@libs/ledgerHardwareWallet/ledgerLiskAppIPCChannel/utils';
import {
  getPubKey,
  getConnectedDevices,
  getSignedMessage,
  getSignedTransaction,
} from './serverLedgerHWCommunication';

const { GET_CONNECTED_DEVICES, GET_SIGNED_MESSAGE, GET_PUB_KEY, GET_SIGNED_TRANSACTION } =
  LEDGER_HW_IPC_CHANNELS;

export const ledgerLiskAppIPCChannel = () => {
  const myq = new Queue();

  createIpcMainChannel(GET_SIGNED_TRANSACTION, async (data) => {
    const id = `${GET_SIGNED_TRANSACTION}-${Date.now()}`;
    console.log('GET_CONNECTED_DEVICES ___ID___', { id, data });
    const result = await getSequentiallyQueuedData(myq, id, () => getSignedTransaction(data));
    return result;
  });

  createIpcMainChannel(GET_SIGNED_MESSAGE, async (data) => {
    const id = `${GET_SIGNED_MESSAGE}-${Date.now()}`;
    console.log('GET_SIGNED_MESSAGE ___ID___', { id, data });
    const result = await getSequentiallyQueuedData(myq, id, () => getSignedMessage(data));
    return result;
  });

  createIpcMainChannel(GET_PUB_KEY, async (data) => {
    const id = `${GET_PUB_KEY}-${Date.now()}`;
    console.log('GET_SIGNED_MESSAGE ___ID___', { id, data });
    const result = await getSequentiallyQueuedData(myq, id, () => getPubKey(data));
    return result;
  });

  createIpcMainChannel(GET_CONNECTED_DEVICES, async (data) => {
    const id = `${GET_CONNECTED_DEVICES}-${Date.now()}`;
    console.log('GET_CONNECTED_DEVICES ___ID___', { id, data });
    const result = await getSequentiallyQueuedData(myq, id, getConnectedDevices);
    return result;
  });
};
